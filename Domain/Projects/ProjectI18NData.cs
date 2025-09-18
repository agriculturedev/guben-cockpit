using System.Text.Json.Serialization;
using Shared.Domain.Validation;

namespace Domain.Projects;

public sealed class ProjectI18NData
{
  public string? FullText { get; private set; }
  public string? Description { get; private set; }

  [JsonConstructor]
  private ProjectI18NData(string? fullText, string? description)
  {
    FullText = fullText;
    Description = description;
  }

  public static Result<ProjectI18NData> Create(string? fullText, string? description)
  {
    return new ProjectI18NData(fullText, description);
  }

  public Result Update(ProjectI18NData data)
  {
    return UpdateFullText(data.FullText)
      .Merge(UpdateDescription(data.Description));
  }

  public Result UpdateFullText(string? newFullText)
  {
    FullText = newFullText;
    return Result.Ok();
  }

  public Result UpdateDescription(string? newDescription)
  {
    Description = newDescription;
    return Result.Ok();
  }

  private static string? Normalize(string? input)
  {
    return string.IsNullOrWhiteSpace(input) ? null : input;
  }
}
