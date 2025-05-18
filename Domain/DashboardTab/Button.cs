using System.Globalization;
using System.Text.Json.Serialization;
using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.DashboardTab;

public class Button : ValueObject
{
  public Dictionary<string, ButtonI18NData> Translations { get; private set; } = new();

  public bool OpenInNewTab { get; private set; }

  private Button(bool openInNewTab)
  {
    OpenInNewTab = openInNewTab;
  }

  public static Result<Button> Create(string title, string url, bool openInNewTab, CultureInfo culture)
  {
    var button = new Button(openInNewTab);

    var updateResult = button.UpdateTranslation(title, url, culture);
    if (updateResult.IsFailure)
      return updateResult;

    return button;
  }

  public Result UpdateTranslation(string title, string url, CultureInfo cultureInfo)
  {
    var (result, cardI18NData) = ButtonI18NData.Create(title, url);
    if (result.IsFailure)
      return result;

    Translations[cultureInfo.TwoLetterISOLanguageName] = cardI18NData;
    return Result.Ok();
  }

  public Result Update(string title, string url, bool openInNewTab, CultureInfo culture)
  {
    OpenInNewTab = openInNewTab;

    return UpdateTranslation(title, url, culture);
  }

  protected override IEnumerable<object> GetEqualityComponents()
  {
    yield return Translations;
    yield return OpenInNewTab;
  }
}

public sealed class ButtonI18NData
{
  public string Title { get; private set; }
  public string Url { get; private set; }

  [JsonConstructor]
  private ButtonI18NData(string title, string url)
  {
    Title = title;
    Url = url;
  }

  public static Result<ButtonI18NData> Create(string title, string description)
  {
    return new ButtonI18NData(title, description);
  }
}
