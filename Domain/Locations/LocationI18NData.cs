using System.Text.Json.Serialization;
using Shared.Domain.Validation;

namespace Domain.Locations;

public sealed class LocationI18NData
{
  public string Name { get; private set; }

  [JsonConstructor]
  private LocationI18NData(string name)
  {
    Name = name;
  }

  public static Result<LocationI18NData> Create(string name)
  {
    return new LocationI18NData(name);
  }
}
