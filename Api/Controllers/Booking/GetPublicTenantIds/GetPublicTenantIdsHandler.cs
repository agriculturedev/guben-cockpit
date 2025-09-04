using Api.Controllers.Bookings.Shared;
using Domain.Booking;
using Domain.Booking.repository;
using Shared.Api;

namespace Api.Controllers.Bookings.GetPublicTenantIds;

public class GetPublicTenantIdsHandler : ApiRequestHandler<GetPublicTenantIdsQuery, GetPublicTenantIdsResponse>
{
    private readonly IBookingRepository _bookingRepository;

    public GetPublicTenantIdsHandler(IBookingRepository bookingRepository)
    {
        _bookingRepository = bookingRepository;
    }

    public override async Task<GetPublicTenantIdsResponse> Handle(GetPublicTenantIdsQuery request, CancellationToken cancellationToken)
    {
        List<Booking> tenantIds = await _bookingRepository.GetAllPublicTenants();

        return new GetPublicTenantIdsResponse()
        {
            Tenants = tenantIds.Select(TenantResponse.Map).ToList()
        };
    }
}