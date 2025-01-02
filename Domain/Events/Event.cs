using System.Collections.ObjectModel;
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
  public Location Location { get; private set; }
  public Coordinates.Coordinates Coordinates { get; private set; }

  private readonly List<Url> _urls;
  public IReadOnlyCollection<Url> Urls => new ReadOnlyCollection<Url>(_urls);

  private readonly List<Category> _categories;
  public IReadOnlyCollection<Category> Categories => new ReadOnlyCollection<Category>(_categories);


  private Event(int eventId, string title, string description, DateTime startDate, DateTime
    endDate, Location location, Coordinates.Coordinates coordinates, List<Url> urls, List<Category> categories)
  {
    Id = eventId;
    Title = title;
    Description = description;
    StartDate = startDate;
    EndDate = endDate;
    Location = location;
    Coordinates = coordinates;
    _urls = urls;
    _categories = categories;
  }

  public static Result<Event> Create(int eventId, string title, string description,
    DateTime startDate, DateTime
      endDate, Location location, Coordinates.Coordinates coordinates, List<Url> urls, List<Category> categories)
  {
    return new Event(eventId, title, description, startDate, endDate, location, coordinates, urls, categories);
  }
}
