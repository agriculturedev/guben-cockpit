using System.Globalization;
using Api.Infrastructure.Translations;
using Domain;
using Domain.DashboardTab;
using Shared.Api;

namespace Api.Controllers.DashboardTabs.Shared;

public struct InformationCardResponse
{
  public required Guid Id { get;  set; }
  public string? Title { get;  set; }
  public string? Description { get;  set; }
  public ButtonResponse? Button { get;  set; }
  public string? ImageUrl { get;  set; }
  public string? ImageAlt { get;  set; }

  public static InformationCardResponse Map(InformationCard informationCard, CultureInfo culture)
  {
    var i18NData = informationCard.Translations.GetTranslation(culture);
    if (i18NData is null)
      throw new ProblemDetailsException(TranslationKeys.NoValidTranslationsFound);

    return new InformationCardResponse()
    {
      Id = informationCard.Id,
      Title = i18NData.Title,
      Description = i18NData.Description,
      ImageUrl = informationCard.ImageUrl,
      ImageAlt = i18NData.ImageAlt,
      Button = informationCard.Button is not null ? ButtonResponse.Map(informationCard.Button, culture) : null,
    };
  }
}
