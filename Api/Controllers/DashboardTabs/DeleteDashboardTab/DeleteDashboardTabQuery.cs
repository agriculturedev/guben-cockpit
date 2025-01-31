using Shared.Api;

namespace Api.Controllers.DashboardTabs.DeleteDashboardTab;

public class DeleteDashboardTabQuery : IAuthenticatedApiRequest, IApiRequest<DeleteDashboardTabResponse>
{
  public required Guid Id { get; set; }
}
