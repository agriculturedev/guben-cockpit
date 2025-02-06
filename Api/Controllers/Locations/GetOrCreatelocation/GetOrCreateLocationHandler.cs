using Api.Infrastructure.Extensions;
using Domain.Locations;
using Domain.Locations.repository;
using Shared.Api;

namespace Api.Controllers.Locations.GetOrCreatelocation;

public class GetOrCreateLocationHandler : ApiRequestHandler<GetOrCreateLocationQuery, GetOrCreateLocationResponse>
{
  private readonly ILocationRepository _locationRepository;

  public GetOrCreateLocationHandler(ILocationRepository locationRepository)
  {
    _locationRepository = locationRepository;
  }

  public override Task<GetOrCreateLocationResponse> Handle(GetOrCreateLocationQuery request,
    CancellationToken cancellationToken)
  {
    Guid locationId;
    var (locationResult, tempLocation) = Location.Create(request.Name, request.City, request.Street, request.TelephoneNumber, request
      .Fax, request.Email, request.Website, request.Zip);
    locationResult.ThrowIfFailure();

    var foundLocation = _locationRepository.Find(tempLocation);
    if (foundLocation is null)
    {
      _locationRepository.Save(tempLocation);
      locationId = tempLocation.Id;
    }
    else
    {
      locationId = foundLocation.Id;
    }

    return Task.FromResult(new GetOrCreateLocationResponse()
    {
      LocationId = locationId,
    });
  }
}
