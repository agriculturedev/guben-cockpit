using System.Globalization;
using Domain.Locations;
using Domain.Time.Extensions;
using Domain.Urls;
using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.Events;

public sealed class Event : Entity<Guid>, IEquatable<Event>
{
  public string EventId { get; private set; }
  public string TerminId { get; private set; }
  public DateTime StartDate { get; private set; }
  public DateTime EndDate { get; private set; }
  public Location Location { get; private set; } = null!;
  public bool Published { get; private set; }
  public Guid CreatedBy { get; private set; }
  public bool Deleted { get; private set; }
  public Dictionary<string, EventI18NData> Translations { get; private set; } = new();
  public Coordinates.Coordinates? Coordinates { get; private set; }

  private readonly List<EventImage> _images = [];
  public IReadOnlyCollection<EventImage> Images => _images.AsReadOnly();

  private readonly List<Url> _urls = [];
  public IReadOnlyCollection<Url> Urls => _urls.AsReadOnly();

  private readonly List<Category.Category> _categories = [];
  public IReadOnlyCollection<Category.Category> Categories => _categories.AsReadOnly();

  private Event(string eventId, string terminId, DateTime startDate, DateTime
    endDate, Coordinates.Coordinates? coordinates, Guid createdBy)
  {
    Id = Guid.CreateVersion7();
    EventId = eventId;
    TerminId = terminId;
    StartDate = startDate.SetKindUtc();
    EndDate = endDate.SetKindUtc();
    Coordinates = coordinates;
    Published = false;
    CreatedBy = createdBy;
    Deleted = false;
    _urls = [];
    _categories = [];
    _images = [];
  }

  public static Result<Event> Create(string eventId, string terminId, string title,
    string description, DateTime startDate, DateTime endDate,
    Location location, Coordinates.Coordinates? coordinates, List<Url> urls,
    List<Category.Category> categories, CultureInfo cultureInfo, Guid createdBy,
    List<EventImage> images)
  {
    var @event = new Event(eventId, terminId, startDate, endDate, coordinates, createdBy);

    var (translationResult, translation) = EventI18NData.Create(title, description);
    if (translationResult.IsFailure)
      return translationResult;

    @event.UpdateTranslation(translation, cultureInfo);
    @event.UpdateLocation(location);
    @event.AddUrls(urls);
    @event.AddCategories(categories);
    @event.AddImages(images);
    return Result.Ok(@event);
  }

  public static Result<Event> CreateWithGeneratedIds(string title, string description,
    DateTime startDate, DateTime
      endDate, Location location, Coordinates.Coordinates? coordinates, List<Url> urls,
    List<Category.Category> categories, CultureInfo cultureInfo, Guid createdBy, List<EventImage> images)
  {
    return Create(Guid.CreateVersion7().ToString(), Guid.CreateVersion7().ToString(),
      title, description, startDate, endDate, location, coordinates,
      urls, categories, cultureInfo, createdBy, images);
  }

  //does not really delete the Object in the DB, but we need this flag for every event that is periodically importet but the user wants to delete
  public void Delete()
  {
    Published = false;
    Deleted = true;
  }

  public void SetPublishedState(bool publish)
  {
    Published = publish;
  }

  public void UpdateTranslation(EventI18NData data, CultureInfo cultureInfo)
  {
    Translations[cultureInfo.TwoLetterISOLanguageName] = data;
  }

  public Result UpsertTranslation(string title, string description, CultureInfo cultureInfo)
  {
    var (result, eventI18NData) = EventI18NData.Create(title, description);
    if (result.IsFailure)
      return result;

    Translations[cultureInfo.TwoLetterISOLanguageName] = eventI18NData;
    return Result.Ok();
  }

  public Result UpdateStartDate(DateTime newStartDate)
  {
    StartDate = newStartDate.SetKindUtc();
    return Result.Ok();
  }

  public Result UpdateEndDate(DateTime newEndDate)
  {
    EndDate = newEndDate.SetKindUtc();
    return Result.Ok();
  }

  private Result UpdateLocation(Location location)
  {
    Location = location;
    return Result.Ok();
  }

  private Result UpdateUrls(IEnumerable<Url> urls)
  {
    _urls.Clear();
    return AddUrls(urls);
  }

  private Result AddUrls(IEnumerable<Url> urls)
  {
    List<Result> results = new();
    foreach (var url in urls)
    {
      results.Add(AddUrl(url));
    }

    return results.MergeResults();
  }

  private Result AddUrl(Url url)
  {
    _urls.Add(url);
    return Result.Ok();
  }

  public Result UpdateCoordinates(Coordinates.Coordinates? coordinates)
  {
    Coordinates = coordinates;
    return Result.Ok();
  }

  private Result UpdateCategories(IEnumerable<Category.Category> newCategories)
  {
    var toRemove = _categories.Where(c => !newCategories.Any(nc => nc.Id == c.Id)).ToList();
    foreach (var category in toRemove)
    {
      _categories.Remove(category);
    }

    foreach (var category in newCategories)
    {
      if (!_categories.Any(c => c.Id == category.Id))
      {
        _categories.Add(category);
      }
    }

    return Result.Ok();
  }

  private Result AddCategories(IEnumerable<Category.Category> categories)
  {
    List<Result> results = new();
    foreach (var category in categories)
    {
      results.Add(AddCategory(category));
    }

    return results.MergeResults();
  }

  private Result AddCategory(Category.Category category)
  {
    _categories.Add(category);
    return Result.Ok();
  }

  private Result AddImage(EventImage image)
  {
    _images.Add(image);
    return Result.Ok();
  }

  private Result AddImages(IEnumerable<EventImage> images)
  {
    List<Result> results = [];
    foreach (var image in images) results.Add(AddImage(image));
    return results.MergeResults();
  }

  private Result UpdateImages(IEnumerable<EventImage> images)
  {
    _images.Clear();
    return AddImages(images);
  }

  public Result Update(Event @event, CultureInfo cultureInfo)
  {
    if (this.Equals(@event))
      return Result.Ok();

    return Update(@event.Translations[cultureInfo.TwoLetterISOLanguageName], @event.StartDate, @event.EndDate,
      @event.Coordinates, @event.Location, @event.Categories.ToList(), @event.Urls.ToList(),
      cultureInfo, @event.Images.ToList());
  }

  public Result Update(EventI18NData translations, DateTime startDate, DateTime endDate,
    Coordinates.Coordinates? coordinates, Location location, IList<Category.Category> categories,
    IList<Url> urls, CultureInfo cultureInfo, IList<EventImage> images)
  {
    UpdateTranslation(translations, cultureInfo);
    var updateStartDateResult = UpdateStartDate(startDate);
    var updateEndDateResult = UpdateEndDate(endDate);
    var updateCoordinatesResult = UpdateCoordinates(coordinates);
    var updateLocationResult = UpdateLocation(location);
    var updateCategoriesResult = UpdateCategories(categories);
    var updateUrlsResult = UpdateUrls(urls);
    var updateImagesResult = UpdateImages(images);

    List<Result> results =
    [
      updateStartDateResult, updateEndDateResult, updateCoordinatesResult,
      updateLocationResult, updateCategoriesResult, updateUrlsResult,
      updateImagesResult
    ];

    return results.MergeResults();
  }

  public bool Equals(Event? other)
  {
    if (other is null) return false;
    if (ReferenceEquals(this, other)) return true;
    return _urls.Equals(other._urls)
           && _categories.Equals(other._categories)
           && _images.Equals(other._images)
           && EventId == other.EventId
           && TerminId == other.TerminId
           && Translations == other.Translations
           && StartDate.Equals(other.StartDate)
           && EndDate.Equals(other.EndDate)
           && Location.Equals(other.Location)
           && Equals(Coordinates, other.Coordinates);
  }

  public override bool Equals(object? obj)
  {
    return ReferenceEquals(this, obj) || obj is Event other && Equals(other);
  }

  public override int GetHashCode()
  {
    var hashCode = new HashCode();
    hashCode.Add(_urls);
    hashCode.Add(_categories);
    hashCode.Add(_images);
    hashCode.Add(EventId);
    hashCode.Add(TerminId);
    hashCode.Add(Translations);
    hashCode.Add(StartDate);
    hashCode.Add(EndDate);
    hashCode.Add(Location);
    hashCode.Add(Coordinates);
    return hashCode.ToHashCode();
  }
}

