using System.Globalization;
using Api.Infrastructure.Translations;
using Domain;
using Domain.Projects;
using Shared.Api;

namespace Api.Controllers.Projects.Shared;

public struct ProjectResponse
{
  public required string Id { get; set; }
  public required int Type { get; set; }
  public required string Title { get; set; }
  public string? Description { get; set; }
  public string? FullText { get; set; }
  public string? ImageCaption { get; set; }
  public string? ImageUrl { get; set; }
  public string? ImageCredits { get; set; }
  public required bool Published { get; set; }
  public Guid? EditorId { get; set; }

  public static ProjectResponse Map(Project @project, CultureInfo cultureInfo)
  {
    var i18NData = @project.Translations.GetTranslation(cultureInfo);
    if (i18NData is null)
      throw new ProblemDetailsException(TranslationKeys.NoValidTranslationsFound);

    return new ProjectResponse()
    {
      Id = @project.Id,
      Type = @project.Type.Value,
      Title = @project.Title,
      Description = i18NData.Description,
      FullText = i18NData.FullText,
      ImageCaption = @project.ImageCaption,
      ImageUrl = @project.ImageUrl,
      ImageCredits = @project.ImageCredits,
      Published = @project.Published,
      EditorId = @project.EditorId
    };
  }
}
