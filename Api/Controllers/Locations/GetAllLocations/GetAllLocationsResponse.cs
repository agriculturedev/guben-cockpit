using Api.Controllers.Locations.Shared;

namespace Api.Controllers.Locations.GetAllLocations;

public struct GetAllLocationsResponse
{
  public required IEnumerable<LocationResponse> Locations { get; set; }
}
