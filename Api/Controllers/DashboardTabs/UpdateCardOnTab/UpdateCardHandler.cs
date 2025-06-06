using System.Globalization;
using Api.Infrastructure.Extensions;
using Domain;
using Domain.DashboardTab;
using Domain.DashboardTab.repository;
using Shared.Api;

namespace Api.Controllers.DashboardTabs.UpdateCardOnTab;

public class UpdateCardOnTabHandler : ApiRequestHandler<UpdateCardOnTabQuery, UpdateCardOnTabResponse>
{
  private readonly IDashboardRepository _dashboardRepository;
  private readonly CultureInfo _culture;

  public UpdateCardOnTabHandler(IDashboardRepository dashboardRepository)
  {
    _dashboardRepository = dashboardRepository;
    _culture = CultureInfo.CurrentCulture;
  }

  public override async Task<UpdateCardOnTabResponse> Handle(UpdateCardOnTabQuery request,
    CancellationToken cancellationToken)
  {
    var dashboardTab = await _dashboardRepository.Get(request.TabId);
    if (dashboardTab is null)
      throw new ProblemDetailsException(TranslationKeys.DashboardTabNotFound);

    var card = dashboardTab.InformationCards.FirstOrDefault(c => c.Id == request.CardId);
    if (card is null)
      throw new ProblemDetailsException(TranslationKeys.InformationCardNotFound);

    if (card.Button is not null && request.Button is null) // DELETE
    {
      card.UpdateButton(null);
    }
    else if (card.Button is not null && request.Button is not null) // UPDATE
    {
      card.Button.Update(request.Button.Title, request.Button.Url, request.Button.OpenInNewTab, _culture);
    }
    else if (card.Button is null && request.Button is not null) // CREATE
    {
      var buttonResult = Button.Create(request.Button.Title, request.Button.Url, request.Button.OpenInNewTab, _culture);
      buttonResult.ThrowIfFailure();
      Button? button = buttonResult.Value;

      card.UpdateButton(button);
    }

    var updateResult = card.Update(request.Title, request.Description, request.ImageUrl, request.ImageAlt,
      _culture);

    updateResult.ThrowIfFailure();

    return new UpdateCardOnTabResponse();
  }
}
