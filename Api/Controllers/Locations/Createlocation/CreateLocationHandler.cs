using System.Globalization;
using Api.Infrastructure.Extensions;
using Domain.Locations;
using Domain.Locations.repository;
using Shared.Api;

namespace Api.Controllers.Locations.Createlocation;

public class CreateLocationHandler : ApiRequestHandler<CreateLocationQuery, CreateLocationResponse>
{
  private readonly ILocationRepository _locationRepository;
  private readonly CultureInfo _culture;

  public CreateLocationHandler(ILocationRepository locationRepository)
  {
    _locationRepository = locationRepository;
    _culture = CultureInfo.CurrentCulture;
  }

  public override async Task<CreateLocationResponse> Handle(CreateLocationQuery request,
    CancellationToken cancellationToken)
  {
    var (locationResult, location) = Location.Create(request.Name, request.City, request.Street, request.TelephoneNumber, request
      .Fax, request.Email, request.Website, request.Zip, _culture);
    locationResult.ThrowIfFailure();

    await _locationRepository.SaveAsync(location);

    return new CreateLocationResponse() {};
  }
}
