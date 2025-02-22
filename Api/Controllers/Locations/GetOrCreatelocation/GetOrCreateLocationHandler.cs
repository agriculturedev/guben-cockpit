using System.Globalization;
using Api.Infrastructure.Extensions;
using Domain.Locations;
using Domain.Locations.repository;
using Shared.Api;

namespace Api.Controllers.Locations.GetOrCreatelocation;

public class GetOrCreateLocationHandler : ApiRequestHandler<GetOrCreateLocationQuery, GetOrCreateLocationResponse>
{
  private readonly ILocationRepository _locationRepository;
  private readonly CultureInfo _culture;

  public GetOrCreateLocationHandler(ILocationRepository locationRepository)
  {
    _locationRepository = locationRepository;
    _culture = CultureInfo.CurrentCulture;
  }

  public override async Task<GetOrCreateLocationResponse> Handle(GetOrCreateLocationQuery request,
    CancellationToken cancellationToken)
  {
    Guid locationId;
    var (locationResult, tempLocation) = Location.Create(request.Name, request.City, request.Street, request.TelephoneNumber, request
      .Fax, request.Email, request.Website, request.Zip, _culture);
    locationResult.ThrowIfFailure();

    var foundLocation = await _locationRepository.FindByName(request.Name, _culture);
    if (foundLocation is null)
    {
      _locationRepository.Save(tempLocation);
      locationId = tempLocation.Id;
    }
    else
    {
      locationId = foundLocation.Id;
    }

    return new GetOrCreateLocationResponse()
    {
      LocationId = locationId,
    };
  }
}
