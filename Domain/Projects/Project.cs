using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.Projects;

public sealed class Project : Entity<string>
{
  public string Title { get; private set; }
  public string? Description { get; private set; }
  public string? FullText { get; private set; }
  public string? ImageCaption { get; private set; }
  public string? ImageUrl { get; private set; }
  public string? ImageCredits { get; private set; }

  private Project(string projectId, string title, string? description, string? imageCaption, string? imageUrl, string?
    imageCredits)
  {
    Id = projectId;
    Title = title;
    Description = description;
    FullText = description;
    ImageCaption = imageCaption;
    ImageUrl = imageUrl;
    ImageCredits = imageCredits;
  }

  public static Result<Project> Create(string projectId, string title, string? description, string? imageCaption,
    string? imageUrl, string? imageCredits)
  {
    return new Project(projectId, title, description, imageCaption, imageUrl, imageCredits);
  }
}
