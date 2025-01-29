using Domain.Locations;

namespace Api.Controllers.Locations.Shared;

public class LocationResponse
{
  public required string Id { get; set; }
  public required string Name { get; set; }
  public string? City { get; set; }

  public static LocationResponse Map(Location location)
  {
    return new LocationResponse
    {
      Id = location.Id.ToString(),
      Name = location.Name,
      City = location.City
    };
  }
}
