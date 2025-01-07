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
  public string Title { get; private set; }
  public string Description { get; private set; }
  public DateTime StartDate { get; private set; }
  public DateTime EndDate { get; private set; }
  public Location Location { get; private set; } = null!;
  public Coordinates.Coordinates? Coordinates { get; private set; }

  private readonly List<Url> _urls = [];
  public IReadOnlyCollection<Url> Urls => _urls.AsReadOnly();

  private readonly List<Category.Category> _categories = [];
  public IReadOnlyCollection<Category.Category> Categories => _categories.AsReadOnly();

  private Event()
  {
  }

  private Event(string eventId, string terminId, string title, string description, DateTime startDate, DateTime
    endDate, Coordinates.Coordinates? coordinates)
  {
    Id = Guid.CreateVersion7();
    EventId = eventId;
    TerminId = terminId;
    Title = title;
    Description = description;
    StartDate = startDate.SetKindUtc();
    EndDate = endDate.SetKindUtc();
    Coordinates = coordinates;
    _urls = [];
    _categories = [];
  }

  public static Result<Event> Create(string eventId, string terminId, string title, string description,
    DateTime startDate, DateTime
      endDate, Location location, Coordinates.Coordinates? coordinates, List<Url> urls,
    List<Category.Category> categories)
  {
    var _event = new Event(eventId, terminId, title, description, startDate, endDate, coordinates);
    _event.UpdateLocation(location);
    _event.AddUrls(urls);
    _event.AddCategories(categories);

    return Result.Ok(_event);
  }

  public Result UpdateTitle(string newTitle)
  {
    if (string.IsNullOrWhiteSpace(newTitle))
      return Result.Error(TranslationKeys.TitleCannotBeEmpty);

    Title = newTitle;
    return Result.Ok();
  }

  public Result UpdateDescription(string newDescription)
  {
    if (string.IsNullOrWhiteSpace(newDescription))
      return Result.Error(TranslationKeys.DescriptionCannotBeEmpty);

    Description = newDescription;
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
    foreach (var url in urls)
    {
      AddUrl(url);
    }

    return Result.Ok();
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
    foreach (var category in categories)
    {
      AddCategory(category);
    }

    return Result.Ok();
  }

  private Result AddCategory(Category.Category category)
  {
    _categories.Add(category);
    return Result.Ok();
  }

  public Result Update(Event @event)
  {
    if (this.Equals(@event))
      return Result.Ok();

    var updateTitleResult = UpdateTitle(@event.Title);
    var updateDescriptionResult = UpdateDescription(@event.Description);
    var updateStartDateResult = UpdateStartDate(@event.StartDate);
    var updateEndDateResult = UpdateEndDate(@event.EndDate);
    var updateCoordinatesResult = UpdateCoordinates(@event.Coordinates);
    var updateLocationResult = UpdateLocation(@event.Location);
    var updateCategoriesResult = UpdateCategories(@event.Categories);
    var updateUrlsResult = UpdateUrls(@event.Urls);

    List<Result> results =
    [
      updateTitleResult, updateDescriptionResult, updateStartDateResult, updateEndDateResult, updateCoordinatesResult,
      updateLocationResult,
      updateCategoriesResult, updateUrlsResult
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
           && Title == other.Title
           && Description == other.Description
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
    hashCode.Add(Title);
    hashCode.Add(Description);
    hashCode.Add(StartDate);
    hashCode.Add(EndDate);
    hashCode.Add(Location);
    hashCode.Add(Coordinates);
    return hashCode.ToHashCode();
  }
}
