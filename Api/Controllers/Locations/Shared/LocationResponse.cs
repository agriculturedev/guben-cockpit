using System.Globalization;
using Api.Infrastructure.Translations;
using Domain;
using Domain.Locations;
using Shared.Api;

namespace Api.Controllers.Locations.Shared;

public struct LocationResponse
{
  public required Guid Id { get; set; }
  public required string Name { get; set; }
  public string? City { get; set; }
  public string? Street { get; set; }
  public string? TelephoneNumber { get; set; }
  public string? Fax { get; set; }
  public string? Email { get; set; }
  public string? Website { get; set; }
  public string? Zip { get; set; }

  public static LocationResponse Map(Location location, CultureInfo cultureInfo)
  {
    var i18NData = location.Translations.GetTranslation(cultureInfo);
    if (i18NData is null)
      throw new ProblemDetailsException(TranslationKeys.NoValidTranslationsFound);

    return new LocationResponse
    {
      Id = location.Id,
      Name = i18NData.Name,
      City = location.City,
      Street = location.Street,
      TelephoneNumber = location.TelephoneNumber,
      Fax = location.Fax,
      Email = location.Email,
      Website = location.Website,
      Zip = location.Zip
    };
  }
}
