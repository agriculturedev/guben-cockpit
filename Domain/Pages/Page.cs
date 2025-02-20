using System.Globalization;
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

  public Result UpdateTranslation(string title, string description, CultureInfo cultureInfo)
  {
    var (result, pageI18NData) = PageI18NData.Create(title, description);
    if (result.IsFailure)
      return result;

    Translations[cultureInfo.TwoLetterISOLanguageName] = pageI18NData;
    return Result.Ok();
  }

  public void UpsertTranslation(PageI18NData data, CultureInfo cultureInfo)
  {
    Translations[cultureInfo.TwoLetterISOLanguageName] = data;
  }
}
