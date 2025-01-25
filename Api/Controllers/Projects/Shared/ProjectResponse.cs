using Domain.Projects;

namespace Api.Controllers.Projects.Shared;

public class ProjectResponse
{
  public string Title { get; set; }
  public string? Description { get; set; }
  public string? FullText { get; set; }
  public string? ImageCaption { get; set; }
  public string? ImageUrl { get; set; }
  public string? ImageCredits { get; set; }

  public static ProjectResponse Map(Project project)
  {
    return new ProjectResponse()
    {
      Title = project.Title,
      Description = project.Description,
      FullText = project.FullText,
      ImageCaption = project.ImageCaption,
      ImageUrl = project.ImageUrl,
      ImageCredits = project.ImageCredits
    };
  }
}
