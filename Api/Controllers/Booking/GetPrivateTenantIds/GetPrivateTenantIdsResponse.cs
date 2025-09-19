using Api.Controllers.Bookings.Shared;

namespace Api.Controllers.Bookings.GetPrivateTenantIds;

public struct GetPrivateTenantIdsResponse
{
    public required List<TenantResponse> Tenants { get; set; }
}