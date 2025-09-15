using System.Globalization;
using System.Net.Http.Json;
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
using Microsoft.Extensions.Configuration;
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

  private readonly LibreTranslator _libreTranslator;

  // Zip Codes of Guben and surrounding are, make this configurable later
  private static readonly HashSet<string> AllowedZips = new()
  {
      "03058",
      "03096",
      "03099",
      "03116",
      "03119",
      "03130",
      "03149",
      "03159",
      "03172",
      "03185",
      "03197"
  };

  private readonly string _xmlUrl =
    "https://eingabe.events-in-brandenburg.de/exportdata/tmbevents_custom_stadtguben.xml";

  public EventImporter(IEventRepository eventRepository, ILocationRepository locationRepository,
    ICustomDbContextFactory<GubenDbContext> dbContextFactory, ICategoryRepository categoryRepository,
    IConfiguration configuration)
  {
    _eventRepository = eventRepository;
    _dbContextFactory = dbContextFactory;
    _categoryRepository = categoryRepository;
    _httpClient = new System.Net.Http.HttpClient();

    _locationImporter = new LocationImporter(locationRepository, dbContextFactory);
    _categoryImporter = new CategoryImporter(categoryRepository, dbContextFactory);

    _libreTranslator = new LibreTranslator(configuration);
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
        try
        {
          await ProcessEventAsync(deserializedObject, German);
        }
        catch (Exception ex)
        {
          Console.WriteLine(ex);
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

    //only keep relevant Events
    if (string.IsNullOrWhiteSpace(location.Zip) || !AllowedZips.Contains(location.Zip))
      return;

    await _categoryImporter.ImportCategory(e);
    await SaveEventAsync(e, location, cultureInfo);
  }

  private async Task SaveEventAsync(XmlEvent xmlEvent, Location location, CultureInfo primaryCulture)
  {
    await ImporterTransactions.ExecuteTransactionAsync(_dbContextFactory, async context =>
    {
      var title = xmlEvent.GetTitle(primaryCulture);
      var description = xmlEvent.GetDescription(primaryCulture);

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

        var images = GetImages(xmlEvent);
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
          primaryCulture,
          User.SystemUserId,
          images.ToList()
        );

        if (eventResult.IsSuccessful)
        {
          await UpsertEventWithAllTranslationsAsync(@event, xmlEvent);
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

  private List<EventImage> GetImages(XmlEvent xmlEvent)
  {
    var images = new List<EventImage>();

    var image1Result = EventImage.Create(
        xmlEvent.Imagelink,
        xmlEvent.Imagelinkbig,
        xmlEvent.ImageLinkXl.Text,
        xmlEvent.ImageLinkXl.Width,
        xmlEvent.ImageLinkXl.Height
    );
    if (image1Result.IsSuccessful) images.Add(image1Result.Value);

    var image2Result = EventImage.Create(
        xmlEvent.Imagelink2,
        xmlEvent.Imagelink2Big,
        xmlEvent.ImageLink2Xl.Text,
        xmlEvent.ImageLink2Xl.Width,
        xmlEvent.ImageLink2Xl.Height
    );
    if (image2Result.IsSuccessful) images.Add(image1Result.Value);

    var image3Result = EventImage.Create(
        xmlEvent.Imagelink3,
        xmlEvent.Imagelink3Big,
        xmlEvent.ImageLink3Xl.Text,
        xmlEvent.ImageLink3Xl.Width,
        xmlEvent.ImageLink3Xl.Height
    );
    if (image3Result.IsSuccessful) images.Add(image1Result.Value);

    return images;
  }

  private async Task<List<Category>> GetCategoriesAsync(XmlEvent xmlEvent, CultureInfo cultureInfo)
  {
    var importedCategories = xmlEvent.GetUserCategories(cultureInfo)
        .Select(details => details.Item2)
        .Where(name => !string.IsNullOrWhiteSpace(name))
        .Distinct();

    var resolvedCategoryNames = importedCategories
        .Select(original =>
            CategoryMapping.Map.TryGetValue(original, out var mapped)
                ? mapped.Name
                : original
        )
        .Where(name => !string.IsNullOrWhiteSpace(name))
        .Distinct()
        .ToList();

    var categories = new List<Category>();

    foreach (var name in resolvedCategoryNames)
    {
      var category = await _categoryRepository.GetByName(name);
      if (category != null)
      {
        categories.Add(category);
      }
    }

    return categories;
  }

  private async Task UpsertEventWithAllTranslationsAsync(Event @event, XmlEvent xmlEvent)
  {
    var existingEvent = await _eventRepository.GetByEventIdAndTerminIdIncludingDeletedAndUnpublished(@event.EventId, @event.TerminId);

    if (existingEvent != null)
    {
      if (existingEvent.Deleted)
        return;

      foreach (var cultureInfo in Cultures)
      {
        var title = xmlEvent.GetTitle(cultureInfo);
        var description = xmlEvent.GetDescription(cultureInfo);

        if (!string.IsNullOrWhiteSpace(title) && !string.IsNullOrEmpty(description))
        {
          existingEvent.UpsertTranslation(title, description, cultureInfo);
        }
      }

      existingEvent.Update(
          @event.StartDate,
          @event.EndDate,
          @event.Coordinates,
          @event.Location,
          @event.Categories.ToList(),
          @event.Urls.ToList(),
          @event.Images.ToList()
      );

      await _eventRepository.SaveAsync(existingEvent);
      return;
    }

    //if its a new Event add Translations
    foreach (var cultureInfo in Cultures)
    {
      if (cultureInfo != German)
      {
        var title = xmlEvent.GetTitle(cultureInfo);
        var description = xmlEvent.GetDescription(cultureInfo);

        if (string.IsNullOrWhiteSpace(title) || string.IsNullOrWhiteSpace(description))
        {
          var gerTitle = xmlEvent.GetTitle(German);
          var gerDes = xmlEvent.GetDescription(German);
          if (!string.IsNullOrWhiteSpace(gerTitle) && !string.IsNullOrWhiteSpace(gerDes))
          {
            var translated = await _libreTranslator.TranslateWithLibreTranslate(cultureInfo, gerTitle, gerDes);

            @event.UpsertTranslation(translated[0], translated[1], cultureInfo);
          }
          else
          {
            Console.WriteLine($"Could not Create Translation, missing German Title or Description: {gerTitle}, {gerDes}");
          }
        }
        else
        {
          @event.UpsertTranslation(title, description, cultureInfo);
        }
      }
    }

    @event.SetPublishedState(true);
    await _eventRepository.SaveAsync(@event);
  }
}
