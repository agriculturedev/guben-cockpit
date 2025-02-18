using System.Xml.Linq;
using Database;
using Domain.Category;
using Domain.Category.repository;
using Domain.Coordinates;
using Domain.Events;
using Domain.Events.repository;
using Domain.Locations;
using Domain.Locations.repository;
using Domain.Urls;
using Shared.Database;

namespace Jobs.EventImporter;

public class EventImporter
{
  private readonly IEventRepository _eventRepository;
  private readonly ILocationRepository _locationRepository;
  private readonly ICategoryRepository _categoryRepository;
  private readonly ICustomDbContextFactory<GubenDbContext> _dbContextFactory;

  private readonly System.Net.Http.HttpClient _httpClient;

  private readonly string _xmlUrl =
    "https://eingabe.events-in-brandenburg.de/exportdata/tmbevents_custom_stadtguben.xml";

  public EventImporter(IEventRepository eventRepository, ILocationRepository locationRepository,
    ICustomDbContextFactory<GubenDbContext> dbContextFactory, ICategoryRepository categoryRepository)
  {
    _eventRepository = eventRepository;
    _locationRepository = locationRepository;
    _dbContextFactory = dbContextFactory;
    _categoryRepository = categoryRepository;
    _httpClient = new System.Net.Http.HttpClient();
  }

  // TODO: batching, see csv importer zorgi
  public async Task Import()
  {
    try
    {
      Console.WriteLine("Starting Event importer...");

      var events = await FetchEventsFromXml();
      foreach (var e in events)
      {
        await ProcessEventAsync(e);
      }

      Console.WriteLine($"Event Import finished");
    }
    catch (Exception ex)
    {
      Console.Error.WriteLine($"Error during import: {ex.Message}");
    }
  }

  private async Task<List<XElement>> FetchEventsFromXml()
  {
    var xmlContent = await _httpClient.GetStringAsync(_xmlUrl);
    var xml = XElement.Parse(xmlContent);
    return xml.Elements("EVENT").ToList();
  }

  private async Task ProcessEventAsync(XElement e)
  {
    try
    {
      await SaveLocationAsync(e);
      await SaveCategoriesAsync(e);
      await SaveEventAsync(e);
    }
    catch (Exception ex)
    {
      Console.Error.WriteLine($"Error processing event: {ex.Message}");
    }
  }

  private async Task SaveEventAsync(XElement e)
  {
    await ImporterTransactions.ExecuteTransactionAsync(_dbContextFactory, async dbContext =>
    {
      var coords = ParseCoordinates(e);
      var location = await GetLocationAsync(e);
      if (location == null)
      {
        Console.WriteLine("Failed to resolve location.");
        return;
      }

      var categories = await GetCategoriesAsync(e);
      var eventDetails = ParseEventDetails(e);

      var (eventResult, @event) = Event.Create(
        eventDetails.EventId,
        eventDetails.TerminId,
        eventDetails.Title,
        eventDetails.Description,
        eventDetails.StartDate,
        eventDetails.EndDate,
        location,
        coords,
        new List<Url>(),
        categories
      );

      if (eventResult.IsSuccessful)
      {
        await UpsertEventAsync(@event);
      }
      else
      {
        throw new Exception("failed to create event");
      }
    });
  }

  private async Task SaveLocationAsync(XElement xml)
  {
    var locationDetails = ParseLocationDetails(xml);
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

  private async Task SaveCategoriesAsync(XElement xml)
  {
    var categories = ParseCategoryDetails(xml)
      .Where(details => details.Id.HasValue && !string.IsNullOrWhiteSpace(details.Name))
      .Select(details => Category.Create(details.Id.Value, details.Name))
      .Where(result => result.IsSuccessful)
      .Select(result => result.Value);

    await ImporterTransactions.ExecuteTransactionAsync(_dbContextFactory, async dbContext => { await UpsertCategoriesAsync(categories.ToList()); });
  }

  private Coordinates? ParseCoordinates(XElement xml)
  {
    var latitude = (double)xml.Element("E_GEOKOORD_LAT");
    var longitude = (double)xml.Element("E_GEOKOORD_LNG");

    var (coordsResult, coords) = Coordinates.Create(latitude, longitude);
    if (coordsResult.IsFailure)
    {
      Console.WriteLine($"Creating coordinates failed with values: {latitude}, {longitude}");
      return null;
    }

    return coords;
  }

  private async Task<Location?> GetLocationAsync(XElement xml)
  {
    var name = (string?)xml.Element("E_LOC_NAME");
    return !string.IsNullOrWhiteSpace(name)
      ? await _locationRepository.FindByName(name)
      : null;
  }

  private async Task<List<Category>> GetCategoriesAsync(XElement xml)
  {
    var categoryNames = ParseCategoryDetails(xml)
      .Select(details => details.Name)
      .Where(name => !string.IsNullOrWhiteSpace(name))
      .Distinct()
      .ToList();

    var categories = new List<Category>();
    foreach (var name in categoryNames)
    {
      var category = await _categoryRepository.GetByName(name);
      if (category != null)
      {
        categories.Add(category);
      }
    }

    return categories;
  }

  private async Task UpsertEventAsync(Event @event)
  {
    try
    {
      var existingEvent = await _eventRepository.GetByEventIdAndTerminId(@event.EventId, @event.TerminId);
      if (existingEvent != null)
      {
        Console.WriteLine($"Updating existing event: {@event.Id}");
        existingEvent.Update(@event);
        return;
      }

      Console.WriteLine($"Creating new event: {@event.Id}");
      @event.SetPublishedState(true);
      await _eventRepository.SaveAsync(@event);
    }
    catch (Exception ex)
    {
      Console.Error.WriteLine($"Error saving event {@event.Id}: {ex.Message}");
      throw;
    }
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

  private async Task UpsertCategoriesAsync(IEnumerable<Category> categories)
  {
    foreach (var category in categories)
    {
      await UpsertCategoryAsync(category);
    }
  }

  private async Task UpsertCategoryAsync(Category category)
  {
    var existingCategory = await _categoryRepository.GetByCategoryId(category.CategoryId);
    if (existingCategory != null)
    {
      Console.WriteLine($"Updating existing category: {category.Id}");
      // TODO: Update logic
      return;
    }

    Console.WriteLine($"Creating new category: {category.Id}");
    await _categoryRepository.SaveAsync(category);
  }

  private (string EventId, string TerminId, string Title, string Description, DateTime StartDate, DateTime EndDate)
    ParseEventDetails(XElement e)
  {
    var datumVon = (string?)e.Element("E_DATUM_VON");
    var datumBis = (string?)e.Element("E_DATUM_BIS");

    var zeitVon = (string?)e.Element("E_ZEIT_VON");
    var zeitBis = (string?)e.Element("E_ZEIT_BIS");

    var parsedZeitVon = !string.IsNullOrWhiteSpace(zeitVon) ? $"T{zeitVon}" : string.Empty;
    var parsedZeitBis = !string.IsNullOrWhiteSpace(zeitBis) ? $"T{zeitBis}" : string.Empty;

    return (
      EventId: (string?)e.Element("EVENT_ID") ?? "",
      TerminId: (string?)e.Element("TERMIN_ID") ?? "",
      Title: (string?)e.Element("E_TITEL") ?? "",
      Description: (string?)e.Element("E_BESCHREIBUNG") ?? "",
      StartDate: DateTime.Parse($"{datumVon}{parsedZeitVon}"),
      EndDate: DateTime.Parse($"{datumBis}{parsedZeitBis}")
    );
  }

  private (string Name, string City, string Street, string Tel, string Fax, string Email, string Web, string Zip)
    ParseLocationDetails(XElement xml)
  {
    return (
      Name: (string?)xml.Element("E_LOC_NAME") ?? "",
      City: (string?)xml.Element("E_LOC_ORT") ?? "",
      Street: (string?)xml.Element("E_LOC_STRASSE") ?? "",
      Tel: (string?)xml.Element("E_LOC_TEL") ?? "",
      Fax: (string?)xml.Element("E_LOC_FAX") ?? "",
      Email: (string?)xml.Element("E_LOC_EMAIL") ?? "",
      Web: (string?)xml.Element("E_LOC_WEB") ?? "",
      Zip: (string?)xml.Element("E_LOC_PLZ") ?? ""
    );
  }

  private IEnumerable<(int? Id, string? Name)> ParseCategoryDetails(XElement xml)
  {
    yield return (xml.GetIntAttribute("E_USERKATEGORIE_ID"), (string?)xml.Element("KATEGORIE_NAME_D"));
    var categoryElements = new[] { "E_USERKATEGORIE2", "E_USERKATEGORIE3", "E_USERKATEGORIE4" };
    foreach (var element in categoryElements)
    {
      yield return (xml.GetIntAttribute(element + "_ID"), (string?)xml.Element(element + "_Name"));
    }
  }
}
