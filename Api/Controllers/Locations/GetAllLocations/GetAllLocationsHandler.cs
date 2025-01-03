using Api.Controllers.Locations.Shared;
using Domain.Locations.repository;
using Shared.Api;

namespace Api.Controllers.Locations.GetAllLocations;

public class GetAllLocationsHandler : ApiRequestHandler<GetAllLocationsQuery, GetAllLocationsResponse>
{
  private readonly ILocationRepository _locationRepository;

  public GetAllLocationsHandler(ILocationRepository locationRepository)
  {
    _locationRepository = locationRepository;
  }

  public override async Task<GetAllLocationsResponse> Handle(GetAllLocationsQuery request, CancellationToken
      cancellationToken)
  {
    var locations = await _locationRepository.GetAll();

    return new GetAllLocationsResponse()
    {
      Locations = locations.Select(LocationResponse.Map).ToList()
    };
  }
}
