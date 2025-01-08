using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Database;
using Domain.Projects;
using Domain.Projects.repository;
using Shared.Database;

namespace Jobs.ProjectImporter;

public class ProjectImporter
{
  private readonly ICustomDbContextFactory<GubenDbContext> _dbContextFactory;
  private readonly IProjectRepository _projectRepository;
  private readonly HttpClientFactory _httpClientFactory;
  private readonly string _url = "https://www.guben.de/index.php?option=com_api&app=guben&resource=articles";

  public ProjectImporter(
    ICustomDbContextFactory<GubenDbContext> dbContextFactory,
    IProjectRepository projectRepository
  )
  {
    _dbContextFactory = dbContextFactory;
    _projectRepository = projectRepository;
    _httpClientFactory = new HttpClientFactory();
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
            async dbContext => { await ProcessProjectAsync(project); });
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
    var httpClient = _httpClientFactory.CreateClient("ProjectImporter");

    var requestMessage = new HttpRequestMessage(HttpMethod.Get, _url);
    var response1 = await httpClient.SendAsync(requestMessage);
    var request = CopyRequest(response1); // because of redirect
    var response = await httpClient.SendAsync(request);

    response.EnsureSuccessStatusCode();

    var jsonResponse = await response.Content.ReadFromJsonAsync<JsonResponse>();
    return jsonResponse.Data;
  }

  private async Task ProcessProjectAsync(RawProject rawProject)
  {
    var (result, project) = Project.Create(
      rawProject.Id, rawProject.Title, rawProject.Introtext, rawProject.Fulltext,
      rawProject.ImageCaption, rawProject.ImageUrl, rawProject.ImageCredits);

    if (result.IsSuccessful)
    {
      var existingProject = await _projectRepository.Get(project.Id);

      if (existingProject is not null)
      {
        // update logic
        return;
      }

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

    var newRequest = new HttpRequestMessage(oldRequest.Method, oldRequest?.RequestUri);

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
          !(oldRequest.RequestUri.Host.Equals(newRequest?.RequestUri?.Host)))
      {
        //do not leak Authorization Header to other hosts
        continue;
      }

      newRequest?.Headers.TryAddWithoutValidation(header.Key, header.Value);
    }

    foreach (var property in oldRequest.Properties)
    {
      newRequest.Properties.Add(property);
    }

    if (response.StatusCode == HttpStatusCode.Redirect
        || response.StatusCode == HttpStatusCode.Found
        || response.StatusCode == HttpStatusCode.SeeOther)
    {
      newRequest.Content = null;
      newRequest.Method = HttpMethod.Get;
    }
    else if (oldRequest.Content != null)
    {
      newRequest.Content = new StreamContent(oldRequest.Content.ReadAsStreamAsync().Result);
    }

    return newRequest;
  }
}

public class HttpClientFactory
{
  public HttpClient CreateClient(string name)
  {
    var handler = new HttpClientHandler
    {
      AutomaticDecompression = DecompressionMethods.All,
    };

    var client = new HttpClient(handler)
    {
      DefaultRequestHeaders =
      {
        Accept = { new MediaTypeWithQualityHeaderValue("application/json") },
        Authorization = new AuthenticationHeaderValue("Bearer", "e4aeacde8b1c4bfc2eb6bc4f81663c4c"),
        UserAgent = { ProductInfoHeaderValue.Parse("Mozilla") },
        AcceptEncoding = { new StringWithQualityHeaderValue("br") },
      }
    };

    return client;
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
  public List<RawProject> Data { get; set; }
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
