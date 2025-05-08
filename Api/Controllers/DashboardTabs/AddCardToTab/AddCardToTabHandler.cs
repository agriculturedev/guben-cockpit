using System.Globalization;
using Api.Infrastructure.Extensions;
using Domain;
using Domain.DashboardTab;
using Domain.DashboardTab.repository;
using Shared.Api;

namespace Api.Controllers.DashboardTabs.AddCardToTab;

public class AddCardToTabHandler : ApiRequestHandler<AddCardToTabQuery, AddCardToTabResponse>
{
  private readonly IDashboardRepository _dashboardRepository;
  private readonly CultureInfo _culture;

  public AddCardToTabHandler(IDashboardRepository dashboardRepository)
  {
    _dashboardRepository = dashboardRepository;
    _culture = CultureInfo.CurrentCulture;
  }

  public override async Task<AddCardToTabResponse> Handle(AddCardToTabQuery request,
    CancellationToken cancellationToken)
  {
    Button? button = null;

    if (request.Button is not null)
    {
      var buttonResult = Button.Create(request.Button.Title, request.Button.Url, request.Button.OpenInNewTab);
      buttonResult.ThrowIfFailure();
      button = buttonResult.Value;
    }

    var (cardResult, informationCard) = InformationCard.Create(request.Title, request.Description, request.ImageUrl,
      request.ImageAlt, button, _culture);
    cardResult.ThrowIfFailure();

    var dashboardTab = await _dashboardRepository.Get(request.TabId);
    if (dashboardTab is null)
      throw new ProblemDetailsException(TranslationKeys.DashboardTabNotFound);

    dashboardTab.AddInformationCard(informationCard);

    return new AddCardToTabResponse();
  }
}
