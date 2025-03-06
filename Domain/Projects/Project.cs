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
  public Guid CreatedBy { get; private set; }
  public bool Highlighted { get; private set; }

  private Project(string id, string title, string? description, string? fullText, string? imageCaption, string? imageUrl, string?
    imageCredits, Guid createdBy, bool highlighted)
  {
    Id = id;
    Title = title;
    Description = description;
    FullText = fullText;
    ImageCaption = imageCaption;
    ImageUrl = imageUrl;
    ImageCredits = imageCredits;
    Published = false;
    CreatedBy = createdBy;
    Highlighted = highlighted;
  }

  public static Result<Project> Create(string id, string title, string? description, string? fullText, string? imageCaption,
    string? imageUrl, string? imageCredits, Guid createdBy, bool highlighted = false)
  {
    return new Project(
      id,
      title,
      description,
      fullText,
      imageCaption,
      imageUrl,
      imageCredits,
      createdBy,
      highlighted
    );
  }

  public static Result<Project> CreateWithGeneratedId(string title, string? description, string? fullText, string? imageCaption,
    string? imageUrl, string? imageCredits, Guid createdBy, bool highlighted = false)
  {
    return new Project(
      Guid.CreateVersion7().ToString(),
      title,
      description,
      fullText,
      imageCaption,
      imageUrl,
      imageCredits,
      createdBy,
      highlighted
    );
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
