using Api.Controllers.Bookings.Shared;

namespace Api.Controllers.Bookings.GetAllTenantIds;

public struct GetAllTenantIdsResponse
{
    public required List<TenantResponse> Tenants { get; set; }
}