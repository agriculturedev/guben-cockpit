using Api.Controllers.Bookings.Shared;

namespace Api.Controllers.Bookings.GetPublicTenantIds;

public struct GetPublicTenantIdsResponse
{
    public required List<TenantResponse> Tenants { get; set; }
}