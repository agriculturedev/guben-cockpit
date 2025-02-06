using Api.Controllers.DashboardTabs.Shared;

namespace Api.Controllers.DashboardTabs.GetAllDashboardTabs;

public struct GetAllDashboardTabsResponse
{
  public List<DashboardTabResponse> Tabs { get; set; }
}
