using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Database;
using Domain.Projects;
using Domain.Projects.repository;
using Domain.Users;
using Jobs.HttpClient;
using Microsoft.Extensions.Configuration;
using Shared.Database;

namespace Jobs.ProjectImporter;

public class ProjectImporter
{
  private readonly ICustomDbContextFactory<GubenDbContext> _dbContextFactory;
  private readonly IProjectRepository _projectRepository;
  private readonly IConfiguration _configuration;
  private readonly System.Net.Http.HttpClient _httpClient;
  private readonly string _url = "https://www.guben.de/index.php?option=com_api&app=guben&resource=articles";

  public ProjectImporter(
    ICustomDbContextFactory<GubenDbContext> dbContextFactory,
    IProjectRepository projectRepository, IConfiguration configuration)
  {
    _dbContextFactory = dbContextFactory;
    _projectRepository = projectRepository;
    _configuration = configuration;
    _httpClient = new System.Net.Http.HttpClient();
  }

  public async Task Import()
  {
    try
    {
      Console.WriteLine("Starting Project Importer...");

      var projects = await FetchProjectsAsync();
      foreach (var project in projects)
      {
        try
        {
          await ImporterTransactions.ExecuteTransactionAsync(_dbContextFactory,
            async (_) => { await UpsertProjectAsync(project); });
        }
        catch
        {
          Console.Error.WriteLine($"Failed to create project");
        }
      }

      Console.WriteLine("Project Import finished.");
    }
    catch (Exception ex)
    {
      Console.Error.WriteLine($"Error during import: {ex.Message}");
    }
  }

  private async Task<List<RawProject>> FetchProjectsAsync()
  {
    _httpClient.AddBearerToken(_configuration, "ProjectImporter");

    var requestMessage = new HttpRequestMessage(HttpMethod.Get, _url);
    var response1 = await _httpClient.SendAsync(requestMessage);
    var request = CopyRequest(response1); // because of redirect
    var response = await _httpClient.SendAsync(request);

    response.EnsureSuccessStatusCode();

    var jsonResponse = await response.Content.ReadFromJsonAsync<JsonResponse>();
    if (jsonResponse is null)
      throw new NullReferenceException("JsonResponse is null");

    return jsonResponse.Data;
  }

  private async Task UpsertProjectAsync(RawProject rawProject)
  {
    if (rawProject.Id is null || rawProject.Title is null)
      throw new NullReferenceException("id and title are required");

    var (result, project) = Project.Create(
      rawProject.Id, rawProject.Title, rawProject.Introtext, rawProject.Fulltext,
      rawProject.ImageCaption, rawProject.ImageUrl, rawProject.ImageCredits, User.SystemUserId);

    if (result.IsSuccessful)
    {
      var existingProject = await _projectRepository.GetIncludingUnpublished(project.Id);

      if (existingProject is not null)
      {
        existingProject.Update(project.Title, project.Description, project.FullText, project.ImageCaption, project.ImageUrl, project.ImageCredits);
        return;
      }

      // newly imported projects should be set to true, but we do not want to overwrite existing project's published state
      project.SetPublishedState(true);
      await _projectRepository.SaveAsync(project);
      Console.WriteLine("Project saved.");
    }
    else
    {
      Console.Error.WriteLine($"Failed to create project");
    }
  }

  private static HttpRequestMessage CopyRequest(HttpResponseMessage response)
  {
    var oldRequest = response.RequestMessage;
    if (oldRequest is null)
      throw new NullReferenceException("oldRequest is null");

    var newRequest = new HttpRequestMessage(oldRequest.Method, oldRequest?.RequestUri);
    if (newRequest.RequestUri is null)
      throw new NullReferenceException("request is null");

    if (response.Headers.Location != null)
    {
      if (response.Headers.Location.IsAbsoluteUri)
      {
        newRequest.RequestUri = response.Headers.Location;
      }
      else
      {
        newRequest.RequestUri = new Uri(newRequest.RequestUri, response.Headers.Location);
      }
    }

    foreach (var header in oldRequest.Headers)
    {
      if (header.Key.Equals("Authorization", StringComparison.OrdinalIgnoreCase) &&
          !(oldRequest.RequestUri!.Host.Equals(newRequest?.RequestUri?.Host)))
      {
        //do not leak Authorization Header to other hosts
        continue;
      }

      newRequest!.Headers.TryAddWithoutValidation(header.Key, header.Value);
    }

    foreach (var property in oldRequest.Options)
    {
      newRequest!.Options.TryAdd(property.Key, property.Value);
    }

    if (response.StatusCode == HttpStatusCode.Redirect
        || response.StatusCode == HttpStatusCode.Found
        || response.StatusCode == HttpStatusCode.SeeOther)
    {
      newRequest!.Content = null;
      newRequest.Method = HttpMethod.Get;
    }
    else if (oldRequest.Content != null)
    {
      newRequest!.Content = new StreamContent(oldRequest.Content.ReadAsStreamAsync().Result);
    }

    return newRequest!;
  }
}

internal class JsonResponse
{
  [JsonPropertyName("err_msg")]
  public string? ErrorMessage { get; set; }

  [JsonPropertyName("err_code")]
  [JsonConverter(typeof(CustomNullableIntegerConverter))]
  public int? ErrorCode { get; set; }

  [JsonPropertyName("response_id")]
  [JsonConverter(typeof(CustomNullableIntegerConverter))]
  public int? ResponseId { get; set; }

  [JsonPropertyName("api")]
  public string? Api { get; set; }

  [JsonPropertyName("version")]
  public string? Version { get; set; }

  [JsonPropertyName("data")]
  public List<RawProject> Data { get; set; } = null!;
}

public class CustomNullableIntegerConverter : JsonConverter<int?>
{
  public override int? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
  {
    return reader.TokenType switch
    {
      JsonTokenType.String => int.TryParse(reader.GetString(), out var value) ? value : (int?)null,
      JsonTokenType.Number => reader.GetInt32(),
      _ => null
    };
  }

  public override void Write(Utf8JsonWriter writer, int? value, JsonSerializerOptions options)
  {
    if (value.HasValue)
      writer.WriteNumberValue(value.Value);
  }
}

internal class RawProject
{
  [JsonPropertyName("id")]
  public string? Id { get; set; }

  [JsonPropertyName("catid")]
  public string? Catid { get; set; }

  [JsonPropertyName("title")]
  public string? Title { get; set; }

  [JsonPropertyName("alias")]
  public string? Alias { get; set; }

  [JsonPropertyName("introtext")]
  public string? Introtext { get; set; }

  [JsonPropertyName("fulltext")]
  public string? Fulltext { get; set; }

  [JsonPropertyName("created")]
  public string? Created { get; set; }

  [JsonPropertyName("publish_up")]
  public string? PublishUp { get; set; }

  [JsonPropertyName("publish_down")]
  public string? PublishDown { get; set; }

  [JsonPropertyName("image_caption")]
  public string? ImageCaption { get; set; }

  [JsonPropertyName("image_credits")]
  public string? ImageCredits { get; set; }

  [JsonPropertyName("image_url")]
  public string? ImageUrl { get; set; }
}
