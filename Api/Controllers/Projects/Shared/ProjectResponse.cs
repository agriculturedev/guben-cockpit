using Domain.Projects;

namespace Api.Controllers.Projects.Shared;

public struct ProjectResponse
{
  public required string Title { get; set; }
  public string? Description { get; set; }
  public string? FullText { get; set; }
  public string? ImageCaption { get; set; }
  public string? ImageUrl { get; set; }
  public string? ImageCredits { get; set; }
  public bool Highlighted { get; set; } // TODO: this is used for the weird 'project carousel' and gubener marktplatz, needs to be clarified if they want more of a list view or whatever

  public static ProjectResponse Map(Project project)
  {
    return new ProjectResponse()
    {
      Title = project.Title,
      Description = project.Description,
      FullText = project.FullText,
      ImageCaption = project.ImageCaption,
      ImageUrl = project.ImageUrl,
      ImageCredits = project.ImageCredits,
      Highlighted = true
    };
  }
}
