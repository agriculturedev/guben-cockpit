using System.Globalization;
using Api.Controllers.DashboardTabs.Shared;
using Domain.DashboardDropdown.repository;
using Domain.DashboardTab.repository;
using Shared.Api;

namespace Api.Controllers.DashboardDropdown.GetAllDashboardDropdown;

public class GetAllDashboardDropdownHandler : ApiRequestHandler<GetAllDashboardDropdownQuery, GetAllDashboardDropdownResponse>
{
    private readonly IDashboardDropdownRepository _dashboardDropdownRepository;
    private readonly IDashboardRepository _dashboardTabRepository;
    private readonly CultureInfo _cultureInfo;

    public GetAllDashboardDropdownHandler(
        IDashboardDropdownRepository dashboardDropdownRepository,
        IDashboardRepository dashboardTabRepository
    )
    {
        _dashboardDropdownRepository = dashboardDropdownRepository;
        _dashboardTabRepository = dashboardTabRepository;
        _cultureInfo = CultureInfo.CurrentCulture;
    }

    public override async Task<GetAllDashboardDropdownResponse> Handle(GetAllDashboardDropdownQuery request, CancellationToken cancellationToken)
    {
        var dashboardDropdowns = await _dashboardDropdownRepository.GetAllNonTracking();
        var dropdownIds = dashboardDropdowns.Select(d => d.Id).ToList();
        
        var dashboardTabs = await _dashboardTabRepository.GetByDropdownIdsAsync(dropdownIds, cancellationToken);
        var tabsByDropdownId = dashboardTabs
            .Where(t => t.DropdownId.HasValue)
            .GroupBy(t => t.DropdownId!.Value)
            .ToDictionary(g => g.Key, g => g.OrderBy(t => t.Sequence).ToList());

        var items = dashboardDropdowns
            .OrderBy(d => d.Rank)
            .Select(d =>
            {
                IEnumerable<DashboardTabResponse>? mappedTabs = null;
                if (tabsByDropdownId.TryGetValue(d.Id, out var ts))
                {
                    mappedTabs = ts.Select(t => DashboardTabResponse.Map(t, _cultureInfo)).ToList();
                }

                return DashboardDropdownResponse.Map(d, _cultureInfo, mappedTabs);
            })
            .ToList();

        return new GetAllDashboardDropdownResponse(){ DashboardDropdowns = items };
    }
}