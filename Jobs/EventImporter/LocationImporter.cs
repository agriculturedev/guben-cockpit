using Database;
using Domain;
using Domain.Locations;
using Domain.Locations.repository;
using Shared.Database;
using Shared.Domain.Validation;

namespace Jobs.EventImporter;

public class LocationImporter
{
  private readonly ILocationRepository _locationRepository;
  private readonly ICustomDbContextFactory<GubenDbContext> _dbContextFactory;

  public LocationImporter(ILocationRepository locationRepository,
    ICustomDbContextFactory<GubenDbContext> dbContextFactory)
  {
    _locationRepository = locationRepository;
    _dbContextFactory = dbContextFactory;
  }

  public async Task<Result<Location>> ImportLocation(XmlEvent @event)
  {
    Location? finalLocation = null;

    try
    {
      var (result, location) = await SaveLocationAsync(@event);
      if (result.IsSuccessful)
        finalLocation = location;
    }
    catch (Exception ex)
    {
      Console.WriteLine(ex);
    }

    if (finalLocation is not null)
      return finalLocation;

    return Result.Error("Something went wrong when importing location");
  }

  private async Task<Result<Location>> SaveLocationAsync(XmlEvent xmlEvent)
  {
    var (i18Nresult, locationI18NData) = GetI18NData(xmlEvent);
    if (i18Nresult.IsFailure)
      return i18Nresult;

    Location? finalLocation = null;
    await ImporterTransactions.ExecuteTransactionAsync(_dbContextFactory, async (_) =>
    {
      var (locationResult, location) = Location.Create(
        xmlEvent.GetLocationCity(),
        xmlEvent.GetLocationStreet(),
        xmlEvent.GetLocationTel(),
        xmlEvent.GetLocationFax(),
        xmlEvent.GetLocationEmail(),
        xmlEvent.GetLocationWeb(),
        xmlEvent.GetLocationZip(),
        locationI18NData
      );

      if (locationResult.IsFailure)
      {
        Console.WriteLine($"Creating location failed {locationResult.ValidationMessages}");
        throw new Exception("Failed to create location");
      }

      finalLocation = await UpsertLocationAsync(location);
    });

    if (finalLocation is not null)
      return finalLocation;

    return Result.Error("Something went wrong when upserting location.");
  }

  private Result<Dictionary<string, LocationI18NData>> GetI18NData(XmlEvent xmlEvent)
  {
    Dictionary<string, LocationI18NData> locationI18NData = new Dictionary<string, LocationI18NData>();

    var englishName = xmlEvent.GetLocationName(EventImporter.English);
    var germanName = xmlEvent.GetLocationName(EventImporter.German);
    var polishName = xmlEvent.GetLocationName(EventImporter.Polish);

    if (!string.IsNullOrWhiteSpace(germanName))
    {
      var (germanResult, germanData) = LocationI18NData.Create(germanName);
      if (germanResult.IsFailure)
        return germanResult;

      locationI18NData[EventImporter.German.TwoLetterISOLanguageName] = germanData;
    }
    else
    {
      return Result.Error(TranslationKeys.NameCannotBeEmpty);
    }

    if (!string.IsNullOrWhiteSpace(englishName))
    {
      var (englishResult, englishData) = LocationI18NData.Create(englishName);
      if (englishResult.IsSuccessful)
        locationI18NData[EventImporter.English.TwoLetterISOLanguageName] = englishData;
    }

    if (!string.IsNullOrWhiteSpace(polishName))
    {
      var (polishResult, polishData) = LocationI18NData.Create(polishName);
      if (polishResult.IsSuccessful)
        locationI18NData[EventImporter.Polish.TwoLetterISOLanguageName] = polishData;
    }

    return locationI18NData;
  }

  private async Task<Location> UpsertLocationAsync(Location location)
  {
    var existingLocation = await _locationRepository.FindByNameAndAddress(
      location.Translations[EventImporter.German.TwoLetterISOLanguageName].Name, location.City, location.Street,
      location.Zip, EventImporter.German);
    if (existingLocation != null)
    {
      Console.WriteLine($"Updating existing location: {location.Id}");
      // TODO: Update logic
      return existingLocation;
    }

    Console.WriteLine($"Creating new location: {location.Id}");
    await _locationRepository.SaveAsync(location);
    return location;
  }
}
