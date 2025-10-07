using System.Globalization;
using Api.Controllers.DashboardDropdown.UpdateDashboardDropdown;
using Api.Infrastructure.Extensions;
using Api.Infrastructure.Keycloak;
using Domain;
using Domain.DashboardDropdown.repository;
using Domain.DashboardTab.repository;
using Domain.Users.repository;
using Shared.Api;

namespace Api.Controllers.DashboardDropdown.UpdateDashboardDropdown;

public class UpdateDashboardDropdownHandler : ApiRequestHandler<UpdateDashboardDropdownQuery, UpdateDashboardDropdownResponse>
{
  private readonly IDashboardDropdownRepository _dashboardDropdownRepository;
  private readonly IUserRepository _userRepository;
  private readonly IHttpContextAccessor _httpContextAccessor;
  private readonly CultureInfo _culture;

  public UpdateDashboardDropdownHandler(IDashboardDropdownRepository dashboardDropdownRepository, IHttpContextAccessor httpContextAccessor, IUserRepository userRepository)
  {
    _dashboardDropdownRepository = dashboardDropdownRepository;
    _userRepository = userRepository;
    _httpContextAccessor = httpContextAccessor;
    _culture = CultureInfo.CurrentCulture;
  }

  public override async Task<UpdateDashboardDropdownResponse> Handle(UpdateDashboardDropdownQuery request, CancellationToken cancellationToken)
  {
    if (request.Id is not Guid dropdownId)
      throw new ProblemDetailsException(TranslationKeys.MissingDashboardDropdownId);

    var keycloakId = _httpContextAccessor.HttpContext?.User.GetKeycloakId();
    if (string.IsNullOrEmpty(keycloakId))
      throw new UnauthorizedAccessException(TranslationKeys.UserNotLoggedIn);

    var user = await _userRepository.GetByKeycloakId(keycloakId);
    if (user is null)
      throw new UnauthorizedAccessException(TranslationKeys.UserNotFound);

    var dashbaordDropdown = await _dashboardDropdownRepository.Get(dropdownId);
    if (dashbaordDropdown is null)
      throw new ProblemDetailsException(TranslationKeys.DashboardDropdownNotFound);

    var isDashboardManager = _httpContextAccessor.HttpContext?.User.IsInRole(KeycloakPolicies.DashboardManager) ?? false;

    if (!isDashboardManager)
      throw new UnauthorizedAccessException(TranslationKeys.NoDashboardManager);

    dashbaordDropdown.Update(request.Title, _culture, dashbaordDropdown.IsLink, dashbaordDropdown.Rank);

    return new UpdateDashboardDropdownResponse();
  }

}