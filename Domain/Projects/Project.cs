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

  // TODO: this should only be temporary, force frank and guben to fix their data source so we get this info or have 2 different sources.
  // don't bother putting in a ui for them to edit it, they should fix their shit. we will set it right ONCE in database
  public bool IsBusiness { get; private set; }

  private Project(string id, string title, string? description, string? fullText, string? imageCaption, string? imageUrl, string?
    imageCredits, Guid createdBy, bool highlighted, bool isBusiness)
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
    IsBusiness = isBusiness;
  }

  public static Result<Project> Create(string id, string title, string? description, string? fullText, string? imageCaption,
    string? imageUrl, string? imageCredits, Guid createdBy, bool highlighted = false, bool isBusiness = false)
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
      highlighted,
      isBusiness
    );
  }

  public static Result<Project> CreateWithGeneratedId(string title, string? description, string? fullText, string? imageCaption,
    string? imageUrl, string? imageCredits, Guid createdBy, bool highlighted = false, bool isBusiness = false)
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
      highlighted,
      isBusiness
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
