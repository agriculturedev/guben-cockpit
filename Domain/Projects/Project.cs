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
  public bool Published { get; private set; }

  private Project(string id, string title, string? description, string? fullText, string? imageCaption, string? imageUrl, string?
    imageCredits)
  {
    Id = id;
    Title = title;
    Description = description;
    FullText = fullText;
    ImageCaption = imageCaption;
    ImageUrl = imageUrl;
    ImageCredits = imageCredits;
    Published = false;
  }

  public static Result<Project> Create(string id, string title, string? description, string? fullText, string? imageCaption,
    string? imageUrl, string? imageCredits)
  {
    return new Project(id, title, description, fullText, imageCaption, imageUrl, imageCredits);
  }

  public void Update(string title, string? description, string? fullText, string? imageCaption, string? imageUrl,
    string? imageCredits)
  {
    Title = title;
    Description = description;
    FullText = fullText;
    ImageCaption = imageCaption;
    ImageUrl = imageUrl;
    ImageCredits = imageCredits;
  }

  public void SetPublishedState(bool publish)
  {
    Published = publish;
  }
}
