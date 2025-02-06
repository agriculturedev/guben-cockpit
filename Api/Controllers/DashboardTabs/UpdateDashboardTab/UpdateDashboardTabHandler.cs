using Api.Infrastructure.Extensions;
using Domain;
using Domain.DashboardTab.repository;
using Shared.Api;

namespace Api.Controllers.DashboardTabs.UpdateDashboardTab;

public class UpdateDashboardTabHandler : ApiRequestHandler<UpdateDashboardTabQuery, UpdateDashboardTabResponse>
{
  private readonly IDashboardRepository _dashboardRepository;

  public UpdateDashboardTabHandler(IDashboardRepository dashboardRepository)
  {
    _dashboardRepository = dashboardRepository;
  }

  public override async Task<UpdateDashboardTabResponse> Handle(UpdateDashboardTabQuery request, CancellationToken cancellationToken)
  {
    var dashboardTab = await _dashboardRepository.Get(request.Id);
    if (dashboardTab is null)
      throw new ProblemDetailsException(TranslationKeys.DashboardTabNotFound);

    var result = dashboardTab.Update(request.Title, request.MapUrl);
    result.ThrowIfFailure();

    return new UpdateDashboardTabResponse();
  }
}
