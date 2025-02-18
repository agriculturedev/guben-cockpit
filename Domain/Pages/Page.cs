using System.Text.Json.Serialization;
using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.Pages;

public sealed class Page : Entity<string>
{
  public Dictionary<string, PageI18NData> Translations { get; private set; } = new();

  private Page(){}

  private Page(string id)
  {
    Id = id;
  }

  public static Result<Page> Create(string id)
  {
    if (string.IsNullOrWhiteSpace(id))
      return Result.Error(TranslationKeys.NameCannotBeEmpty);

    return new Page(id);
  }

  public Result UpdateTranslation(string languageKey, string title, string description)
  {
    var (result, pageI18NData) = PageI18NData.Create(title, description);
    if (result.IsFailure)
      return result;

    Translations[languageKey] = pageI18NData;
    return Result.Ok();
  }
}

public sealed class PageI18NData
{
  public string Title { get; private set; }
  public string Description { get; private set; }

  [JsonConstructor]
  private PageI18NData(string title, string description)
  {
    Title = title;
    Description = description;
  }

  public static Result<PageI18NData> Create(string title, string description)
  {
    return new PageI18NData(title, description);
  }
}
