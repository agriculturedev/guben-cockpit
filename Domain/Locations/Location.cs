using System.Collections.ObjectModel;
using System.Globalization;
using Domain.Events;
using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.Locations;

public sealed class Location : Entity<Guid>, IEquatable<Location>
{
  public Dictionary<string, LocationI18NData> Translations { get; private set; } = new();
  public string? City { get; private set; }
  public string? Street { get; private set; }
  public string? TelephoneNumber { get; private set; }
  public string? Fax { get; private set; }
  public string? Email { get; private set; }
  public string? Website { get; private set; }
  public string? Zip { get; private set; }

  private readonly List<Event> _events;
  public IReadOnlyCollection<Event> Events => new ReadOnlyCollection<Event>(_events);

  private Location(string? city, string? street, string? telephoneNumber, string? fax, string? email,
    string? website, string? zip)
  {
    Id = Guid.CreateVersion7();
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
    string? fax, string? email, string? website, string? zip, CultureInfo cultureInfo)
  {
    var location = new Location(city, street, telephoneNumber, fax, email, website, zip);

    var (translationResult, translation) = LocationI18NData.Create(name);
    if (translationResult.IsFailure)
      return translationResult;

    location.UpdateTranslation(translation, cultureInfo);

    return Result.Ok(location);
  }

  public static Result<Location> Create(string? city, string? street, string? telephoneNumber,
    string? fax, string? email, string? website, string? zip, Dictionary<string, LocationI18NData> translations)
  {
    var location = new Location(city, street, telephoneNumber, fax, email, website, zip);

    foreach (KeyValuePair<string, LocationI18NData> entry in translations)
    {
      location.UpdateTranslation(entry.Value, new CultureInfo(entry.Key));
    }

    return Result.Ok(location);
  }

  public void UpdateTranslation(LocationI18NData data, CultureInfo cultureInfo)
  {
    Translations[cultureInfo.TwoLetterISOLanguageName] = data;
  }

  public Result UpsertTranslation(string name, CultureInfo cultureInfo)
  {
    var (result, eventI18NData) = LocationI18NData.Create(name);
    if (result.IsFailure)
      return result;

    Translations[cultureInfo.TwoLetterISOLanguageName] = eventI18NData;
    return Result.Ok();
  }

  public void AddEvent(Event @event) // event is a reserved keyword, use @
  {
    _events.Add(@event);
  }

  public bool Equals(Location? other)
  {
    if (other is null) return false;
    if (ReferenceEquals(this, other)) return true;
    return _events.Equals(other._events) && Translations == other.Translations && City == other.City && Street == other.Street &&
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
    hashCode.Add(Translations);
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
