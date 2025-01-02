using Domain.Locations;
using Domain.Urls;
using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.Events;
public sealed class Event : Entity<int>
{
  public string Title { get; private set; }
  public string Description { get; private set; }
  public DateTime StartDate { get; private set; }
  public DateTime EndDate { get; private set; }
  public Location Location { get; private set; } = null!;
  public Coordinates.Coordinates? Coordinates { get; private set; }

  private readonly List<Url> _urls;
  public IReadOnlyCollection<Url> Urls => _urls.AsReadOnly();

  private readonly List<Category.Category> _categories;
  public IReadOnlyCollection<Category.Category> Categories => _categories.AsReadOnly();

  // private Event() { }

  private Event(int id, string title, string description, DateTime startDate, DateTime
    endDate, Coordinates.Coordinates? coordinates)
  {
    Id = id;
    Title = title;
    Description = description;
    StartDate = startDate;
    EndDate = endDate;
    Coordinates = coordinates;
    _urls = [];
    _categories = [];
  }

  private Result UpdateLocation(Location location)
  {
    Location = location;
    return Result.Ok();
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

  public static Result<Event> Create(int eventId, string title, string description,
    DateTime startDate, DateTime
      endDate, Location location, Coordinates.Coordinates? coordinates, List<Url> urls, List<Category.Category> categories)
  {
    var _event = new Event(eventId, title, description, startDate, endDate, coordinates);
    _event.UpdateLocation(location);
    _event.AddUrls(urls);
    _event.AddCategories(categories);

    return Result.Ok(_event);
  }
}
