using System.Globalization;
using Api.Controllers.DashboardTabs.Shared;
using Api.Infrastructure.Extensions;
using Domain;
using Domain.DashboardTab.repository;
using Domain.Users.repository;
using Shared.Api;

namespace Api.Controllers.DashboardTabs.GetAllDashboardTabs;

public class GetAllDashboardTabsHandler : ApiRequestHandler<GetAllDashboardTabsQuery, GetAllDashboardTabsResponse>
{
  private readonly IDashboardRepository _dashboardRepository;
  private readonly IUserRepository _userRepository;
  private readonly IHttpContextAccessor _httpContextAccessor;
  private readonly CultureInfo _culture;

  public GetAllDashboardTabsHandler(
    IDashboardRepository dashboardRepository,
    IUserRepository userRepository,
    IHttpContextAccessor httpContextAccessor
  )
  {
    _dashboardRepository = dashboardRepository;
    _userRepository = userRepository;
    _httpContextAccessor = httpContextAccessor;
    _culture = CultureInfo.CurrentCulture;
  }

  public override async Task<GetAllDashboardTabsResponse> Handle(GetAllDashboardTabsQuery request, CancellationToken cancellationToken)
  {
    var keycloakId = _httpContextAccessor.HttpContext?.User.GetKeycloakId();
    if (keycloakId is null)
      throw new UnauthorizedAccessException(TranslationKeys.UserNotLoggedIn);

    var currentUser = await _userRepository.GetByKeycloakId(keycloakId);
    if (currentUser is null)
      throw new ProblemDetailsException(TranslationKeys.UserNotFound);

    var dashboardTabs = await _dashboardRepository.GetAll();
    if (dashboardTabs is null)
      return new GetAllDashboardTabsResponse();

    return new GetAllDashboardTabsResponse()
    {
      Tabs = dashboardTabs.Select(t => DashboardTabResponse.Map(t, _culture, currentUser)).ToList()
    };
  }
}
