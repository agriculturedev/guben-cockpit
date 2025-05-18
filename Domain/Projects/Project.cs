using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.Projects;

public sealed class Project : Entity<string>
{
  // If its a Project CatName is "Stadtentwicklung" (city planning), if its a Business its "Gubener Marktplatz" (Gubener city market)
  public ProjectType Type { get; private set; }
  public string Title { get; private set; }
  public string? Description { get; private set; }
  public string? FullText { get; private set; }
  public string? ImageCaption { get; private set; }
  public string? ImageUrl { get; private set; }
  public string? ImageCredits { get; private set; }
  public bool Published { get; private set; }
  public Guid CreatedBy { get; private set; }

  private Project(string id, ProjectType type, string title, string? description, string? fullText, string? imageCaption, string? imageUrl, string?
    imageCredits, Guid createdBy)
  {
    Id = id;
    Type = type;
    Title = title;
    Description = description;
    FullText = fullText;
    ImageCaption = imageCaption;
    ImageUrl = imageUrl;
    ImageCredits = imageCredits;
    Published = false;
    CreatedBy = createdBy;
  }

  public static Result<Project> Create(string id, ProjectType type, string title, string? description, string? fullText, string? imageCaption,
    string? imageUrl, string? imageCredits, Guid createdBy)
  {
    return new Project(
      id,
      type,
      title,
      description,
      fullText,
      imageCaption,
      imageUrl,
      imageCredits,
      createdBy
    );
  }

  public static Result<Project> CreateWithGeneratedId(ProjectType type, string title, string? description, string? fullText, string? imageCaption,
    string? imageUrl, string? imageCredits, Guid createdBy)
  {
    return new Project(
      Guid.CreateVersion7().ToString(),
      type,
      title,
      description,
      fullText,
      imageCaption,
      imageUrl,
      imageCredits,
      createdBy
    );
  }

  public void Update(ProjectType type,string title, string? description, string? fullText, string? imageCaption, string? imageUrl,
    string? imageCredits)
  {
    Type = type;
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
