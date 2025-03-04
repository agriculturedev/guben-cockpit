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
using Domain.Users;
using Shared.Database;

namespace Jobs.EventImporter;

public class EventImporter
{
  public static readonly CultureInfo German = new CultureInfo("de");
  public static readonly CultureInfo English = new CultureInfo("en");
  public static readonly CultureInfo Polish = new CultureInfo("pl");

  public static readonly List<CultureInfo> Cultures = [German, English, Polish];

  private readonly IEventRepository _eventRepository;
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
      foreach (var e in events)
      {
        using StringReader reader = new StringReader(e.ToString());
        var deserializedObject = (XmlEvent)serializer.Deserialize(reader)!;
        foreach (var cultureInfo in Cultures)
        {
          try
          {
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
    var (locationResult, location) = await _locationImporter.ImportLocation(e);
    if (locationResult.IsFailure)
      throw new Exception("Location import failed");

    await _categoryImporter.ImportCategory(e);
    await SaveEventAsync(e, location, cultureInfo);
  }

  private async Task SaveEventAsync(XmlEvent xmlEvent, Location location, CultureInfo cultureInfo)
  {
    await ImporterTransactions.ExecuteTransactionAsync(_dbContextFactory, async context =>
    {
      var title = xmlEvent.GetTitle(cultureInfo);
      var description = xmlEvent.GetDescription(cultureInfo);

      if (!string.IsNullOrWhiteSpace(title) && title.ToLower().Contains("school"))
      {
        var test = 1;
      }

      if (!string.IsNullOrWhiteSpace(title) && !string.IsNullOrEmpty(description))
      {
        // add location to context manually otherwise ef tried to re-insert the same location
        // because getting it from the db created a newly tracked instance for some reason
        var locationInContext = context.Set<Location>().Attach(location).Entity;

        var coords = ParseCoordinates(xmlEvent);

        var categories = await GetCategoriesAsync(xmlEvent, German);

        var (eventResult, @event) = Event.Create(
          xmlEvent.GetEventId(),
          xmlEvent.GetTerminId(),
          title,
          description,
          xmlEvent.GetStartDate(),
          xmlEvent.GetEndDate(),
          locationInContext,
          coords,
          new List<Url>(),
          categories,
          cultureInfo,
          User.SystemUserId
        );

        if (eventResult.IsSuccessful)
        {
          await UpsertEventAsync(@event, cultureInfo);
        }
        else
        {
          throw new Exception("failed to create event");
        }
      }
    });
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
    var existingEvent = await _eventRepository.GetByEventIdAndTerminIdIncludingUnpublished(@event.EventId, @event.TerminId);
    if (existingEvent != null)
    { // TODO@JOREN: Update seems to be buggy, it is not properly adding new translations on update, perhaps ef comparison of json
      Console.WriteLine($"Updating existing event: {@event.Id}");
      var updateResult = existingEvent.Update(@event, cultureInfo);
      if (updateResult.IsFailure)
        throw new Exception($"Failed to update existing event {updateResult.ValidationMessages}");
      return;
    }

    Console.WriteLine($"Creating new event: {@event.Id}");
    @event.SetPublishedState(true);
    await _eventRepository.SaveAsync(@event);
  }
}
