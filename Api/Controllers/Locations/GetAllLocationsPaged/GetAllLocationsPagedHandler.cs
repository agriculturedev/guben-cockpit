using System.Globalization;
using Api.Controllers.Locations.Shared;
using Domain.Locations.repository;
using Shared.Api;

namespace Api.Controllers.Locations.GetAllLocationsPaged;

public class GetAllLocationsPagedHandler : ApiPagedRequestHandler<GetAllLocationsPagedQuery, GetAllLocationsPagedResponse, LocationResponse>
{
  private readonly ILocationRepository _locationRepository;
  private readonly CultureInfo _culture;

  public GetAllLocationsPagedHandler(ILocationRepository locationRepository)
  {
    _locationRepository = locationRepository;
    _culture = CultureInfo.CurrentCulture;
  }

  public override async Task<GetAllLocationsPagedResponse> Handle(GetAllLocationsPagedQuery request, CancellationToken
      cancellationToken)
  {
    var pagedResult = await _locationRepository.GetAllPaged(request);

    return new GetAllLocationsPagedResponse()
    {
      PageNumber = pagedResult.PageNumber,
      PageSize = pagedResult.PageSize,
      TotalCount = pagedResult.TotalCount,
      PageCount = pagedResult.PageCount,
      Results = pagedResult.Results.Select(e => LocationResponse.Map(e, _culture))
    };
  }
}
