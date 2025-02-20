using System.Globalization;
using Database;
using Domain.Locations;
using Domain.Locations.repository;
using Shared.Database;

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

  public async Task ImportLocation(XmlEvent @event)
  {
    // foreach (var cultureInfo in EventImporter.Cultures)
    // {
      try
      {
        await SaveLocationAsync(@event, EventImporter.Cultures[0]); // TODO@JOREN: german only for now, but needs translations too
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex);
      }
    // }
  }

  private async Task SaveLocationAsync(XmlEvent xmlEvent, CultureInfo cultureInfo)
  {
    var locationDetails = ParseLocationDetails(xmlEvent, cultureInfo);
    if (string.IsNullOrWhiteSpace(locationDetails.Name))
    {
      Console.WriteLine("Location name is empty.");
      return;
    }

    await ImporterTransactions.ExecuteTransactionAsync(_dbContextFactory, async dbContext =>
    {
      var (locationResult, location) = Location.Create(
        locationDetails.Name,
        locationDetails.City,
        locationDetails.Street,
        locationDetails.Tel,
        locationDetails.Fax,
        locationDetails.Email,
        locationDetails.Web,
        locationDetails.Zip
      );

      if (locationResult.IsFailure)
      {
        Console.WriteLine($"Creating location failed: {locationDetails}");
        throw new Exception("Failed to create location");
      }

      await UpsertLocationAsync(location);
    });
  }

  private async Task UpsertLocationAsync(Location location)
  {
    var existingLocation = _locationRepository.Find(location);
    if (existingLocation != null)
    {
      Console.WriteLine($"Updating existing location: {location.Name}");
      // TODO: Update logic
      return;
    }

    Console.WriteLine($"Creating new location: {location.Id}");
    await _locationRepository.SaveAsync(location);
  }

  private (string Name, string? City, string? Street, string? Tel, string? Fax, string? Email, string? Web, string? Zip)
    ParseLocationDetails(XmlEvent xmlEvent, CultureInfo cultureInfo)
  {
    var name = xmlEvent.GetLocationName(cultureInfo);
    if (string.IsNullOrWhiteSpace(name))
      throw new Exception("location has no name, this is required");

    return (
      Name: name,
      City: xmlEvent.GetLocationCity(cultureInfo),
      Street: xmlEvent.GetLocationStreet(cultureInfo),
      Tel: xmlEvent.GetLocationTel(cultureInfo),
      Fax: xmlEvent.GetLocationFax(cultureInfo),
      Email: xmlEvent.GetLocationEmail(cultureInfo),
      Web: xmlEvent.GetLocationWeb(cultureInfo),
      Zip: xmlEvent.GetLocationZip(cultureInfo)
    );
  }
}
