using System.Collections.ObjectModel;
using Domain.Events;
using Shared.Domain.Validation;

namespace Domain.Locations;

public sealed class Location
{
  public string Name { get; private set; }
  public string? City { get; private set; }
  public string? Street { get; private set; }
  public string? TelephoneNumber { get; private set; }
  public string? Fax { get; private set; }
  public string? Email { get; private set; }
  public string? Website { get; private set; }
  public string? Zip { get; private set; }

  private readonly List<Event> _events;
  public IReadOnlyCollection<Event> Events => new ReadOnlyCollection<Event>(_events);

  private Location(string name, string? city, string? street, string? telephoneNumber, string? fax, string? email,
    string? website, string? zip)
  {
    Name = name;
    City = city;
    Street = street;
    TelephoneNumber = telephoneNumber;
    Fax = fax;
    Email = email;
    Website = website;
    Zip = zip;
    _events = [];
  }

  public static Result<Location> Create(string name, string? city, string? street, string? telephoneNumber,
    string? fax, string? email, string? website, string? zip)
  {
    return new Location(name, city, street, telephoneNumber, fax, email, website, zip);
  }

  public void AddEvent(Event @event) // event is a reserved keyword, use @
  {
    _events.Add(@event);
  }
}
