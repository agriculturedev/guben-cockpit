using System.Globalization;
using System.Xml.Linq;
using System.Xml.Serialization;
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
  private static readonly CultureInfo German = new CultureInfo("de");
  private static readonly CultureInfo English = new CultureInfo("en");
  private static readonly CultureInfo Polish = new CultureInfo("pl");

  public static readonly List<CultureInfo> Cultures = [German, English, Polish];

  private readonly IEventRepository _eventRepository;
  private readonly ILocationRepository _locationRepository;
  private readonly ICategoryRepository _categoryRepository;
  private readonly ICustomDbContextFactory<GubenDbContext> _dbContextFactory;

  private readonly LocationImporter _locationImporter;
  private readonly CategoryImporter _categoryImporter;

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

    _locationImporter = new LocationImporter(locationRepository, dbContextFactory);
    _categoryImporter = new CategoryImporter(categoryRepository, dbContextFactory);
  }

  // TODO: batching, see csv importer zorgi
  public async Task Import()
  {
    try
    {
      Console.WriteLine("Starting Event importer...");

      var events = await FetchEventsFromXml();
      XmlSerializer serializer = new XmlSerializer(typeof(XmlEvent));
      foreach (var e in events[new Range(0, 100)])
      {
        foreach (var cultureInfo in Cultures)
        {
          try
          {
            using StringReader reader = new StringReader(e.ToString());
            var deserializedObject = (XmlEvent)serializer.Deserialize(reader)!;
            await ProcessEventAsync(deserializedObject, cultureInfo);
          }
          catch (Exception ex)
          {
            Console.WriteLine(ex);
          }
        }
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

  private async Task ProcessEventAsync(XmlEvent e, CultureInfo cultureInfo)
  {
    await _locationImporter.ImportLocation(e);
    await _categoryImporter.ImportCategory(e);
    await SaveEventAsync(e, cultureInfo);
  }

  private async Task SaveEventAsync(XmlEvent xmlEvent, CultureInfo cultureInfo)
  {
    await ImporterTransactions.ExecuteTransactionAsync(_dbContextFactory, async dbContext =>
    {
      var coords = ParseCoordinates(xmlEvent);
      var location = await GetLocationAsync(xmlEvent, German);
      if (location == null)
      {
        Console.WriteLine("Failed to resolve location.");
        return;
      }

      var categories = await GetCategoriesAsync(xmlEvent, German);

      var (eventResult, @event) = Event.Create(
        xmlEvent.GetEventId(),
        xmlEvent.GetTerminId(),
        xmlEvent.GetTitle(cultureInfo) ?? string.Empty,
        xmlEvent.GetDescription(cultureInfo) ?? string.Empty,
        xmlEvent.GetStartDate(),
        xmlEvent.GetEndDate(),
        location,
        coords,
        new List<Url>(),
        categories,
        cultureInfo
      );

      if (eventResult.IsSuccessful)
      {
        await UpsertEventAsync(@event, cultureInfo);
      }
      else
      {
        throw new Exception("failed to create event");
      }
    });
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

  private Coordinates? ParseCoordinates(XmlEvent xmlEvent)
  {
    var latitude = xmlEvent.GetLatitude();
    var longitude = xmlEvent.GetLongitude();

    if (latitude.HasValue && longitude.HasValue)
    {
      var (coordsResult, coords) = Coordinates.Create(latitude.Value, longitude.Value);
      if (coordsResult.IsFailure)
      {
        Console.WriteLine($"Creating coordinates failed with values: {latitude}, {longitude}");
        return null;
      }
      return coords;
    }

    return null;
  }

  private async Task<Location?> GetLocationAsync(XmlEvent xmlEvent, CultureInfo cultureInfo)
  {
    var name = xmlEvent.GetLocationName(cultureInfo);
    return !string.IsNullOrWhiteSpace(name)
      ? await _locationRepository.FindByName(name)
      : null;
  }

  private async Task<List<Category>> GetCategoriesAsync(XmlEvent xmlEvent, CultureInfo cultureInfo)
  {
    var categoryNames = xmlEvent.GetUserCategories(cultureInfo)
      .Select(details => details.Item2)
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

  private async Task UpsertEventAsync(Event @event, CultureInfo cultureInfo)
  {
    var existingEvent = await _eventRepository.GetByEventIdAndTerminId(@event.EventId, @event.TerminId);
    if (existingEvent != null)
    {
      Console.WriteLine($"Updating existing event: {@event.Id}");
      var updateResult = existingEvent.Update(@event, cultureInfo);
      if (updateResult.IsFailure)
        throw new Exception($"Failed to update existing event {updateResult.ValidationMessages}");
      return;
    }

    Console.WriteLine($"Creating new event: {@event.Id}");
    await _eventRepository.SaveAsync(@event);
  }
}
