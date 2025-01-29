using Api.Controllers.DashboardTabs.Shared;

namespace Api.Controllers.DashboardTabs.GetAllDashboardTabs;

public class GetAllDashboardTabsResponse
{
  public List<DashboardTabResponse> Tabs { get; set; }
}
