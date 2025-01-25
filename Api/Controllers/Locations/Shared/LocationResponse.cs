using Domain.Locations;

namespace Api.Controllers.Locations.Shared;

public class LocationResponse
{
  public required string Name { get; set; }
  public string? City { get; set; }
  public static LocationResponse Map(Location location)
  {
    return new LocationResponse()
    {
      Name = location.Name,
      City = location.City
    };
  }
}
