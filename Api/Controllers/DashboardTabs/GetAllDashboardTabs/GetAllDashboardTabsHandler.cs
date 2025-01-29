using Api.Controllers.DashboardTabs.Shared;
using Domain.DashboardTab.repository;
using Shared.Api;

namespace Api.Controllers.DashboardTabs.GetAllDashboardTabs;

public class GetAllDashboardTabsHandler : ApiRequestHandler<GetAllDashboardTabsQuery, GetAllDashboardTabsResponse>
{
  private readonly IDashboardRepository _dashboardRepository;

  public GetAllDashboardTabsHandler(IDashboardRepository dashboardRepository)
  {
    _dashboardRepository = dashboardRepository;
  }

  public override async Task<GetAllDashboardTabsResponse> Handle(GetAllDashboardTabsQuery request, CancellationToken cancellationToken)
  {
    var dashboardTabs = await _dashboardRepository.GetAll();

    if (dashboardTabs is null)
      return new GetAllDashboardTabsResponse();

    return new GetAllDashboardTabsResponse()
    {
      Tabs = dashboardTabs.Select(DashboardTabResponse.Map).ToList()
    };
  }
}
