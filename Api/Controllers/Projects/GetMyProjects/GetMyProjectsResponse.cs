using System.Globalization;
using Api.Infrastructure.Translations;
using Domain;
using Domain.Projects;
using Domain.Users.repository;
using Shared.Api;

namespace Api.Controllers.Projects.GetMyProjects;


public struct GetMyProjectsResponse
{
  public required IEnumerable<GetMyProjectsResponseItem> Results { get; init; }
}
public struct GetMyProjectsResponseItem
{
  public required string Id { get; init; }
  public required int Type { get; init; }
  public required string Title { get; init; }
  public string? Description { get; init; }
  public string? FullText { get; init; }
  public string? ImageCaption { get; init; }
  public string? ImageUrl { get; init; }
  public string? ImageCredits { get; init; }
  public required bool Published { get; init; }
  public string? EditorEmail { get; init; }

  public static async Task<GetMyProjectsResponseItem> MapAsync(Project project, CultureInfo cultureInfo, IUserRepository userRepository)
  {
    var translation = project.Translations.GetTranslation(cultureInfo);

    // If translations is not there and no Fallback as well, just send empty string
    string description = !string.IsNullOrWhiteSpace(translation?.Description) ? translation.Description : "";
    string fullText    = !string.IsNullOrWhiteSpace(translation?.FullText) ? translation.FullText : "";

    string? editorEmail = null;
    if (project.EditorId.HasValue)
    {
      var editor = await userRepository.GetById(project.EditorId.Value);
      editorEmail = editor?.Email;
    }

    return new GetMyProjectsResponseItem
    {
      Id = project.Id,
      Type = project.Type.Value,
      Title = project.Title,
      Description = description,
      FullText = fullText,
      ImageCaption = project.ImageCaption,
      ImageUrl = project.ImageUrl,
      ImageCredits = project.ImageCredits,
      Published = project.Published,
      EditorEmail = editorEmail
    };
  }
}