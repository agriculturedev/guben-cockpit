using Api.Controllers.Geo.Shared;

namespace Api.Controllers.Geo.GetGeoDataSources;

public struct GetGeoDataSourcesResponse
{
  public required IEnumerable<GeoDataSourceResponse> Sources { get; set; }
}
