using Api.Infrastructure.Extensions;
using Domain;
using Domain.DashboardTab;
using Domain.DashboardTab.repository;
using Shared.Api;

namespace Api.Controllers.DashboardTabs.DeleteDashboardTab;

public class DeleteDashboardTabHandler : ApiRequestHandler<DeleteDashboardTabQuery, DeleteDashboardTabResponse>
{
  private readonly IDashboardRepository _dashboardRepository;

  public DeleteDashboardTabHandler(IDashboardRepository dashboardRepository)
  {
    _dashboardRepository = dashboardRepository;
  }

  public override async Task<DeleteDashboardTabResponse> Handle(DeleteDashboardTabQuery request, CancellationToken cancellationToken)
  {
    var dashboardTabToDelete = await _dashboardRepository.Get(request.Id);
    if (dashboardTabToDelete is null)
      throw new ProblemDetailsException(TranslationKeys.DashboardTabNotFound);

    _dashboardRepository.Delete(dashboardTabToDelete);

    return new DeleteDashboardTabResponse();
  }
}
