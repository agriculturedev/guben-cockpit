using System.Collections.ObjectModel;
using Domain.Events;
using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.Locations;

public sealed class Location : Entity<Guid>, IEquatable<Location>
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
    Id = Guid.CreateVersion7();
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

  public bool Equals(Location? other)
  {
    if (other is null) return false;
    if (ReferenceEquals(this, other)) return true;
    return _events.Equals(other._events) && Name == other.Name && City == other.City && Street == other.Street &&
           TelephoneNumber == other.TelephoneNumber && Fax == other.Fax && Email == other.Email &&
           Website == other.Website && Zip == other.Zip;
  }

  public override bool Equals(object? obj)
  {
    return ReferenceEquals(this, obj) || obj is Location other && Equals(other);
  }

  public override int GetHashCode()
  {
    var hashCode = new HashCode();
    hashCode.Add(_events);
    hashCode.Add(Name);
    hashCode.Add(City);
    hashCode.Add(Street);
    hashCode.Add(TelephoneNumber);
    hashCode.Add(Fax);
    hashCode.Add(Email);
    hashCode.Add(Website);
    hashCode.Add(Zip);
    return hashCode.ToHashCode();
  }
}
