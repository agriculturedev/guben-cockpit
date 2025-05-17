using System.Globalization;
using Api.Controllers.DashboardTabs.Shared;
using Domain.DashboardTab.repository;
using Shared.Api;

namespace Api.Controllers.DashboardTabs.GetAllDashboardTabs;

public class GetAllDashboardTabsHandler : ApiRequestHandler<GetAllDashboardTabsQuery, GetAllDashboardTabsResponse>
{
  private readonly IDashboardRepository _dashboardRepository;
  private readonly CultureInfo _culture;

  public GetAllDashboardTabsHandler(IDashboardRepository dashboardRepository)
  {
    _dashboardRepository = dashboardRepository;
    _culture = CultureInfo.CurrentCulture;
  }

  public override async Task<GetAllDashboardTabsResponse> Handle(GetAllDashboardTabsQuery request, CancellationToken cancellationToken)
  {
    var dashboardTabs = await _dashboardRepository.GetAll();
    if (dashboardTabs is null)
      return new GetAllDashboardTabsResponse();

    return new GetAllDashboardTabsResponse()
    {
      Tabs = dashboardTabs.Select(t => DashboardTabResponse.Map(t, _culture)).ToList()
    };
  }
}
