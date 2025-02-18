using System.Globalization;
using Api.Infrastructure.Translations;
using Domain;
using Domain.Pages;

namespace Api.Controllers.Pages.Shared;

public struct PageResponse
{
  public required string Id { get; set; }
  public required string Title { get; set; }
  public required string Description { get; set; }

  public static PageResponse Map(Page page, CultureInfo culture)
  {
    var i18NData = page.Translations.GetTranslation(culture.TwoLetterISOLanguageName);
    if (i18NData is null)
      throw new NullReferenceException(TranslationKeys.NoValidTranslationsFound);

    return new PageResponse
    {
      Id = page.Id,
      Title = i18NData.Title,
      Description = i18NData.Description
    };
  }
}

public class PageI18NDataResponse : IPageI18NData
{
  public required string Title { get; set; }
  public required string Description { get; set; }

  public static PageI18NDataResponse Map<T>(T data) where T : IPageI18NData
  {
    return new PageI18NDataResponse()
    {
      Title = data.Title,
      Description = data.Description
    };
  }
}
