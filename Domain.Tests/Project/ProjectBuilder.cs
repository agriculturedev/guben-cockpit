using Domain.Projects;

namespace Domain.Tests.Project;

public class ProjectBuilder
{
  private string _id = Guid.NewGuid().ToString();
  private ProjectType _type = ProjectType.GubenerMarktplatz;
  private string _title = "Default Title";
  private string? _description;
  private string? _fullText;
  private string? _imageCaption;
  private string? _imageUrl;
  private string? _imageCredits;
  private Guid _createdBy = Guid.NewGuid();

  public ProjectBuilder WithId(string id)
  {
    _id = id;
    return this;
  }

  public ProjectBuilder WithTitle(string title)
  {
    _title = title;
    return this;
  }

  public ProjectBuilder WithDescription(string? description)
  {
    _description = description;
    return this;
  }

  public ProjectBuilder WithFullText(string? fullText)
  {
    _fullText = fullText;
    return this;
  }

  public ProjectBuilder WithImageCaption(string? imageCaption)
  {
    _imageCaption = imageCaption;
    return this;
  }

  public ProjectBuilder WithImageUrl(string? imageUrl)
  {
    _imageUrl = imageUrl;
    return this;
  }

  public ProjectBuilder WithImageCredits(string? imageCredits)
  {
    _imageCredits = imageCredits;
    return this;
  }

  public ProjectBuilder WithCreatedBy(Guid createdBy)
  {
    _createdBy = createdBy;
    return this;
  }

  public ProjectBuilder WithType(ProjectType type)
  {
    _type = type;
    return this;
  }

  public Projects.Project Build()
  {
    var (result, project) = Projects.Project.Create(_id, _type, _title, _description, _fullText, _imageCaption, _imageUrl, _imageCredits, _createdBy);
    if (result.IsFailure)
      throw new ArgumentException(result.ToString());

    return project;
  }

  public Projects.Project BuildWithGeneratedId()
  {
    var (result, project) = Projects.Project.CreateWithGeneratedId(_type, _title, _description, _fullText, _imageCaption, _imageUrl, _imageCredits, _createdBy);
    if (result.IsFailure)
      throw new ArgumentException(result.ToString());

    return project;
  }
}
