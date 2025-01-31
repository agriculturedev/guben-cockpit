using Api.Infrastructure.Extensions;
using Domain;
using Domain.DashboardTab.repository;
using Shared.Api;

namespace Api.Controllers.DashboardTabs.DeleteCardFromTab;

public class DeleteCardFromTabHandler : ApiRequestHandler<DeleteCardFromTabQuery, DeleteCardFromTabResponse>
{
  private readonly IDashboardRepository _dashboardRepository;

  public DeleteCardFromTabHandler(IDashboardRepository dashboardRepository)
  {
    _dashboardRepository = dashboardRepository;
  }

  public override async Task<DeleteCardFromTabResponse> Handle(DeleteCardFromTabQuery request, CancellationToken cancellationToken)
  {
    var dashboardTab = await _dashboardRepository.Get(request.Id);
    if (dashboardTab is null)
      throw new ProblemDetailsException(TranslationKeys.DashboardTabNotFound);

    var result = dashboardTab.DeleteInformationCard(request.CardId);
    result.ThrowIfFailure();

    return new DeleteCardFromTabResponse();
  }
}
