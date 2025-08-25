using Shared.Api;

namespace Api.Controllers.Bookings.CreateTenantId;

public class CreateTenantIdQuery : IApiRequest<CreateTenantIdResponse>
{
	public required string TenantId { get; set; }
}