using System.Globalization;
using Api.Infrastructure.Extensions;
using Domain.DashboardDropdown;
using Domain.DashboardDropdown.repository;
using Shared.Api;

namespace Api.Controllers.DashboardDropdown.CreateDashboardDropdown;

public class CreateDashboardDropdownHandler : ApiRequestHandler<CreateDashboardDropdownQuery, CreateDashboardDropdownResponse>
{
    private readonly IDashboardDropdownRepository _dashboardDropdownRepository;
    private readonly CultureInfo _culture;

    public CreateDashboardDropdownHandler(IDashboardDropdownRepository dashboardDropdownRepository)
    {
        _dashboardDropdownRepository = dashboardDropdownRepository;
        _culture = CultureInfo.CurrentCulture;
    }

    public override async Task<CreateDashboardDropdownResponse> Handle(CreateDashboardDropdownQuery request, CancellationToken cancellationToken)
    {
        int nextRank = _dashboardDropdownRepository.GetNextRank();

        var (result, dashboardDropdown) = DashbaordDropdown.Create(request.Title, _culture, nextRank, request.Link);
        result.ThrowIfFailure();

        await _dashboardDropdownRepository.SaveAsync(dashboardDropdown);

        return new CreateDashboardDropdownResponse();
    }
}