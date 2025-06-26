using Api.Controllers.Geo.Shared;
using Domain.GeoDataSource.repository;
using Shared.Api;

namespace Api.Controllers.Geo.GetGeoDataSources;

public class GetGeoDataSourcesHandler : ApiRequestHandler<GetGeoDataSourcesQuery, GetGeoDataSourcesResponse>
{
  private readonly IGeoDataSourceRepository _geoDataSourceRepository;

  public GetGeoDataSourcesHandler(IGeoDataSourceRepository geoDataSourceRepository)
  {
    _geoDataSourceRepository = geoDataSourceRepository;
  }

  public override async Task<GetGeoDataSourcesResponse> Handle(GetGeoDataSourcesQuery request, CancellationToken cancellationToken)
  {
    var sources = await _geoDataSourceRepository.GetAll();

    return new GetGeoDataSourcesResponse()
    {
      Sources = sources.Select(GeoDataSourceResponse.Map)
    };
  }
}
