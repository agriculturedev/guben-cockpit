using System.Globalization;
using Api.Infrastructure.Translations;
using Domain;
using Domain.Pages;
using Shared.Api;

namespace Api.Controllers.Pages.Shared;

public struct PageResponse
{
  public required string Id { get; set; }
  public required string Title { get; set; }
  public required string Description { get; set; }

  public static PageResponse Map(Page page, CultureInfo cultureInfo)
  {
    var i18NData = page.Translations.GetTranslation(cultureInfo);
    if (i18NData is null)
      throw new ProblemDetailsException(TranslationKeys.NoValidTranslationsFound);

    return new PageResponse
    {
      Id = page.Id,
      Title = i18NData.Title,
      Description = i18NData.Description
    };
  }
}
