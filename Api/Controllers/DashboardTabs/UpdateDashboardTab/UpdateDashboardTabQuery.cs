using Shared.Api;

namespace Api.Controllers.DashboardTabs.UpdateDashboardTab;

public class UpdateDashboardTabQuery : IAuthenticatedApiRequest, IApiRequest<UpdateDashboardTabResponse>
{
  public required Guid Id { get; set; }
  public required string Name { get; set; }
  public required string MapUrl { get; set; }
}
