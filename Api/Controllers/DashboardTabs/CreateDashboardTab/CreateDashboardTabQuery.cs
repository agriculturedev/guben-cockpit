using Shared.Api;

namespace Api.Controllers.DashboardTabs.CreateDashboardTab;

public class CreateDashboardTabQuery : IAuthenticatedApiRequest, IApiRequest<CreateDashboardTabResponse>
{
  public required string Title { get; set; }
  public required string MapUrl { get; set; }
  public required Guid DropdownId { get; set; }
}
