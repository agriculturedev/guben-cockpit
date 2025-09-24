using System.Globalization;
using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.Projects;

public sealed class Project : Entity<string>
{
  // If its a Project CatName is "Stadtentwicklung" (city planning), if its a Business its "Gubener Marktplatz" (Gubener city market)
  public ProjectType Type { get; private set; }
  public string Title { get; private set; }
  public string? ImageCaption { get; private set; }
  public string? ImageUrl { get; private set; }
  public string? ImageCredits { get; private set; }
  public bool Published { get; private set; }
  public Guid CreatedBy { get; private set; }
  public bool Deleted { get; private set; }
  public Guid? EditorId { get; private set; }
  public Dictionary<string, ProjectI18NData> Translations { get; private set; } = new();

  private Project(string id, ProjectType type, string title, string? imageCaption, string? imageUrl, string?
    imageCredits, Guid createdBy, Guid? editorId)
  {
    Id = id;
    Type = type;
    Title = title;
    ImageCaption = imageCaption;
    ImageUrl = imageUrl;
    ImageCredits = imageCredits;
    Published = false;
    CreatedBy = createdBy;
    Deleted = false;
    EditorId = editorId;
  }

  public static Result<Project> Create(string id, ProjectType type, string title, string? description, string? fullText, string? imageCaption,
    string? imageUrl, string? imageCredits, Guid createdBy, Guid? editorId, CultureInfo cultureInfo)
  {
    var @project = new Project(
      id,
      type,
      title,
      imageCaption,
      imageUrl,
      imageCredits,
      createdBy,
      editorId
    );

    var (translationResult, translation) = ProjectI18NData.Create(fullText, description);
    if (translationResult.IsFailure)
      return translationResult;

    @project.UpdateTranslation(translation, cultureInfo);

    return Result.Ok(@project);
  }

  public static Result<Project> CreateWithGeneratedId(ProjectType type, string title, string? description, string? fullText, string? imageCaption,
    string? imageUrl, string? imageCredits, Guid createdBy, Guid? editorId, CultureInfo cultureInfo)
  {
    return Create(
      Guid.CreateVersion7().ToString(),
      type,
      title,
      description,
      fullText,
      imageCaption,
      imageUrl,
      imageCredits,
      createdBy,
      editorId,
      cultureInfo
    );
  }

  public void Update(ProjectType type, string title, string? imageCaption, string? imageUrl,
    string? imageCredits, Guid? editorId, CultureInfo cultureInfo, ProjectI18NData translations)
  {
    UpdateTranslation(translations, cultureInfo);
    Type = type;
    Title = title;
    ImageCaption = imageCaption;
    ImageUrl = imageUrl;
    ImageCredits = imageCredits;
    EditorId = editorId;
  }

  public void Update(ProjectType type, string title, string? imageCaption, string? imageUrl,
    string? imageCredit, Guid? editorId)
  {
    Type = type;
    Title = title;
    ImageCaption = imageCaption;
    ImageUrl = imageUrl;
    ImageCredits = imageCredit;
    EditorId = editorId;
  }

  // Does not truly delete the entity in the DB, but we need this for Projects that we fetch every 24h or so
  public void Delete()
  {
    Published = false;
    Deleted = true;
  }

  public void SetPublishedState(bool publish)
  {
    Published = publish;
  }

  public void UpdateTranslation(ProjectI18NData data, CultureInfo cultureInfo)
  {
    Translations[cultureInfo.TwoLetterISOLanguageName] = data;
  }
  
  public Result UpsertTranslation(string? fullText, string? description, CultureInfo cultureInfo)
  {
    var (result, projectI18NData) = ProjectI18NData.Create(fullText, description);
    if (result.IsFailure)
      return result;

    Translations[cultureInfo.TwoLetterISOLanguageName] = projectI18NData;
    return Result.Ok();
  }

}
