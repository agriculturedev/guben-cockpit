using Api.Infrastructure.Extensions;
using Domain;
using Domain.DashboardTab;
using Domain.DashboardTab.repository;
using Shared.Api;

namespace Api.Controllers.DashboardTabs.UpdateCardOnTab;

public class UpdateCardOnTabHandler : ApiRequestHandler<UpdateCardOnTabQuery, UpdateCardOnTabResponse>
{
  private readonly IDashboardRepository _dashboardRepository;

  public UpdateCardOnTabHandler(IDashboardRepository dashboardRepository)
  {
    _dashboardRepository = dashboardRepository;
  }

  public override async Task<UpdateCardOnTabResponse> Handle(UpdateCardOnTabQuery request, CancellationToken cancellationToken)
  {
    var dashboardTab = await _dashboardRepository.Get(request.TabId);
    if (dashboardTab is null)
      throw new ProblemDetailsException(TranslationKeys.DashboardTabNotFound);

    var card = dashboardTab.InformationCards.FirstOrDefault(c => c.Id == request.CardId);
    if (card is null)
      throw new ProblemDetailsException(TranslationKeys.InformationCardNotFound);

    Button? button = null;

    if (request.Button is not null)
    {
      var buttonResult = Button.Create(request.Button.Title, request.Button.Url, request.Button.OpenInNewTab);
      buttonResult.ThrowIfFailure();
      button = buttonResult.Value;
    }

    card.Update(request.Title, request.Description, request.ImageUrl, request.ImageAlt, button);

    return new UpdateCardOnTabResponse();
  }
}
