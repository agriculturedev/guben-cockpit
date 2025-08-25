using Api.Controllers.Bookings.GetAllTenantIds;
using Api.Controllers.Bookings.Shared;
using Api.Infrastructure.Extensions;
using Api.Infrastructure.Keycloak;
using Domain;
using Domain.Booking;
using Domain.Booking.repository;
using Domain.Users.repository;
using Shared.Api;

namespace Api.Controllers.Projects.GetAllTenantIds;

public class GetAllTenantIdsHandler : ApiRequestHandler<GetAllTenantIdsQuery, GetAllTenantIdsResponse>
{
	private readonly IBookingRepository _bookingRepository;

	public GetAllTenantIdsHandler(IBookingRepository bookingRepository)
	{
		_bookingRepository = bookingRepository;
	}

	public override async Task<GetAllTenantIdsResponse> Handle(GetAllTenantIdsQuery request, CancellationToken cancellationToken)
	{
		List<Booking> tenantIds = await _bookingRepository.GetAllTenants();

		return new GetAllTenantIdsResponse()
		{
			Tenants = tenantIds.Select(TenantResponse.Map).ToList()
		};
	}
}