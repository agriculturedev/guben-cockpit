using Api.Controllers.Locations.Shared;

namespace Api.Controllers.Locations.GetAllLocations;

public class GetAllLocationsResponse
{
  public required IEnumerable<LocationResponse> Locations { get; set; }
}
