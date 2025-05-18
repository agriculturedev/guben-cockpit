using System.Globalization;
using Api.Infrastructure.Extensions;
using Domain.DashboardTab;
using Domain.DashboardTab.repository;
using Shared.Api;

namespace Api.Controllers.DashboardTabs.CreateDashboardTab;

public class CreateDashboardTabHandler : ApiRequestHandler<CreateDashboardTabQuery, CreateDashboardTabResponse>
{
  private readonly IDashboardRepository _dashboardRepository;
  private readonly CultureInfo _culture;

  public CreateDashboardTabHandler(IDashboardRepository dashboardRepository)
  {
    _dashboardRepository = dashboardRepository;
    _culture = CultureInfo.CurrentCulture;

  }

  public override async Task<CreateDashboardTabResponse> Handle(CreateDashboardTabQuery request, CancellationToken cancellationToken)
  {
    int nextSequence = _dashboardRepository.GetNextSequence();

    var (result, dashboardTab) = DashboardTab.Create(request.Title, nextSequence, request.MapUrl, new List<InformationCard>(), _culture);
    result.ThrowIfFailure();

    await _dashboardRepository.SaveAsync(dashboardTab);

    return new CreateDashboardTabResponse();
  }
}
