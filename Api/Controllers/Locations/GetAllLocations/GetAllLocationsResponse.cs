using Api.Controllers.Locations.Shared;

namespace Api.Controllers.Locations.GetAllLocations;

public class GetAllLocationsResponse
{
  public IEnumerable<LocationResponse> Locations { get; set; }
}
