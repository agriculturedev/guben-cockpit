using System.Globalization;
using Api.Infrastructure.Translations;
using Domain;
using Domain.DashboardTab;
using Shared.Api;

namespace Api.Controllers.DashboardTabs.Shared;

public struct DashboardTabResponse
{
  public required Guid Id { get; set; }
  public required string Title { get; set; }
  public required int Sequence { get; set; }
  public required string MapUrl { get; set; }
  public IEnumerable<InformationCardResponse> InformationCards { get; set; }

  public static DashboardTabResponse Map(DashboardTab dashboardTab, CultureInfo culture)
  {
    var i18NData = dashboardTab.Translations.GetTranslation(culture);
    if (i18NData is null)
      throw new ProblemDetailsException(TranslationKeys.NoValidTranslationsFound);

    return new DashboardTabResponse()
    {
      Id = dashboardTab.Id,
      Title = i18NData.Title,
      Sequence = dashboardTab.Sequence,
      MapUrl = dashboardTab.MapUrl,
      InformationCards = dashboardTab.InformationCards.Select(c => InformationCardResponse.Map(c, culture)).ToList(),
    };
  }
}
