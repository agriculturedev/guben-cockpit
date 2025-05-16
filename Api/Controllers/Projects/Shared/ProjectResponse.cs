using Domain.Projects;

namespace Api.Controllers.Projects.Shared;

public struct ProjectResponse
{
  public required string Id { get; set; }
  public required string CatName { get; set; }
  public required string Title { get; set; }
  public string? Description { get; set; }
  public string? FullText { get; set; }
  public string? ImageCaption { get; set; }
  public string? ImageUrl { get; set; }
  public string? ImageCredits { get; set; }
  public required bool Published { get; set; }

  public static ProjectResponse Map(Project project)
  {
    return new ProjectResponse()
    {
      Id = project.Id,
      CatName = project.CatName,
      Title = project.Title,
      Description = project.Description,
      FullText = project.FullText,
      ImageCaption = project.ImageCaption,
      ImageUrl = project.ImageUrl,
      ImageCredits = project.ImageCredits,
      Published = project.Published
    };
  }
}
