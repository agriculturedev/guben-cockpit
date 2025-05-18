using System.Globalization;
using Api.Infrastructure.Translations;
using Domain;
using Domain.DashboardTab;
using Shared.Api;

namespace Api.Controllers.DashboardTabs.Shared;

public struct ButtonResponse
{
  public required string Title { get; set; }
  public required string Url { get; set; }
  public required bool OpenInNewTab { get; set; }

  public static ButtonResponse Map(Button button, CultureInfo culture)
  {
    var i18NData = button.Translations.GetTranslation(culture);
    if (i18NData is null)
      throw new ProblemDetailsException(TranslationKeys.NoValidTranslationsFound);

    return new ButtonResponse()
    {
      Title = i18NData.Title,
      Url = i18NData.Url,
      OpenInNewTab = button.OpenInNewTab
    };
  }
}
