using Shared.Api;

namespace Api.Controllers.DashboardTabs.UpdateDashboardTab;

public class UpdateDashboardTabQuery : IAuthenticatedApiRequest, IApiRequest<UpdateDashboardTabResponse>
{
  public required Guid Id { get; set; }
  public required string Title { get; set; }
  public required string MapUrl { get; set; }
}
