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

  public Dictionary<string, EventI18NData> Translations { get; private set; } = new();
  public Coordinates.Coordinates? Coordinates { get; private set; }

  private readonly List<Url> _urls = [];
  public IReadOnlyCollection<Url> Urls => _urls.AsReadOnly();

  private readonly List<Category.Category> _categories = [];
  public IReadOnlyCollection<Category.Category> Categories => _categories.AsReadOnly();

  private Event(string eventId, string terminId, DateTime startDate, DateTime
    endDate, Coordinates.Coordinates? coordinates)
  {
    Id = Guid.CreateVersion7();
    EventId = eventId;
    TerminId = terminId;
    StartDate = startDate.SetKindUtc();
    EndDate = endDate.SetKindUtc();
    Coordinates = coordinates;
    _urls = [];
    _categories = [];
  }

  public static Result<Event> Create(string eventId, string terminId, string title, string description,
    DateTime startDate, DateTime
      endDate, Location location, Coordinates.Coordinates? coordinates, List<Url> urls,
    List<Category.Category> categories, CultureInfo cultureInfo)
  {
    var @event = new Event(eventId, terminId, startDate, endDate, coordinates);

    var (translationResult, translation) = EventI18NData.Create(title, description);
    if (translationResult.IsFailure)
      return translationResult;

    @event.UpdateTranslation(translation, cultureInfo);
    @event.UpdateLocation(location);
    @event.AddUrls(urls);
    @event.AddCategories(categories);
    // TODO: use UpdateTitle

    return Result.Ok(@event);
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

  private Result UpdateCategories(IEnumerable<Category.Category> categories)
  {
    _categories.Clear();
    return AddCategories(categories);
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

  public Result Update(Event @event, CultureInfo cultureInfo)
  {
    if (this.Equals(@event))
      return Result.Ok();

    UpdateTranslation(@event.Translations[cultureInfo.TwoLetterISOLanguageName], cultureInfo);
    var updateStartDateResult = UpdateStartDate(@event.StartDate);
    var updateEndDateResult = UpdateEndDate(@event.EndDate);
    var updateCoordinatesResult = UpdateCoordinates(@event.Coordinates);
    var updateLocationResult = UpdateLocation(@event.Location);
    var updateCategoriesResult = UpdateCategories(@event.Categories);
    var updateUrlsResult = UpdateUrls(@event.Urls);

    List<Result> results =
    [
      updateStartDateResult, updateEndDateResult, updateCoordinatesResult,
      updateLocationResult, updateCategoriesResult, updateUrlsResult
    ];

    return results.MergeResults();
  }

  public bool Equals(Event? other)
  {
    if (other is null) return false;
    if (ReferenceEquals(this, other)) return true;
    return _urls.Equals(other._urls)
           && _categories.Equals(other._categories)
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

