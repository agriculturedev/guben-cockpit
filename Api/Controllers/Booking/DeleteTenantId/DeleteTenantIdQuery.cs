using Api.Controllers.Bookings.DeleteTenantId;
using Shared.Api;

namespace Api.Controllers.Projects.DeleteTenantId;

public class DeleteTenantIdQuery : IApiRequest<DeleteTenantIdResponse>
{
  public required Guid Id { get; set; }
}