using Api.Infrastructure.Extensions;
using Domain;
using Domain.DashboardTab.repository;
using Shared.Api;

namespace Api.Controllers.DashboardTabs.RemoveCardFromTab;

public class RemoveCardFromTabHandler : ApiRequestHandler<RemoveCardFromTabQuery, RemoveCardFromTabResponse>
{
  private readonly IDashboardRepository _dashboardRepository;

  public RemoveCardFromTabHandler(IDashboardRepository dashboardRepository)
  {
    _dashboardRepository = dashboardRepository;
  }

  public override async Task<RemoveCardFromTabResponse> Handle(RemoveCardFromTabQuery request, CancellationToken cancellationToken)
  {
    var dashboardTab = await _dashboardRepository.Get(request.Id);
    if (dashboardTab is null)
      throw new ProblemDetailsException(TranslationKeys.DashboardTabNotFound);

    var result = dashboardTab.DeleteInformationCard(request.CardId);
    result.ThrowIfFailure();

    return new RemoveCardFromTabResponse();
  }
}
