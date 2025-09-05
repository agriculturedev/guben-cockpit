using Shared.Api;

namespace Api.Controllers.Bookings.UpdateTenant;

public class UpdateTenantQuery : IAuthenticatedApiRequest, IApiRequest<UpdateTenantResponse>
{
  public Guid? Id { get; private set; }
  public required string TenantId { get; set; }
  public bool? ForPublicUse { get; set; }

  public void SetId(Guid id) => Id = id;
}