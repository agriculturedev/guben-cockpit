using System.Globalization;
using Api.Infrastructure.Extensions;
using Domain.DashboardTab;
using Domain.DashboardTab.repository;
using Domain.Users.repository;
using Shared.Api;

namespace Api.Controllers.DashboardTabs.CreateDashboardTab;

public class CreateDashboardTabHandler : ApiRequestHandler<CreateDashboardTabQuery, CreateDashboardTabResponse>
{
  private readonly IDashboardRepository _dashboardRepository;
  private readonly IUserRepository _userRepository;
  private readonly CultureInfo _culture;

  public CreateDashboardTabHandler(
    IDashboardRepository dashboardRepository,
    IUserRepository userRepository
  )
  {
    _dashboardRepository = dashboardRepository;
    _userRepository = userRepository;
    _culture = CultureInfo.CurrentCulture;
  }

  public override async Task<CreateDashboardTabResponse> Handle(CreateDashboardTabQuery request, CancellationToken cancellationToken)
  {
    int nextSequence = _dashboardRepository.GetNextSequence();

    Guid? editorUserId = null;
    
    if (!string.IsNullOrWhiteSpace(request.EditorEmail))
    {
      var normalizedEmail = request.EditorEmail.Trim().ToLowerInvariant();
      var user = await _userRepository.GetByEmailAsync(normalizedEmail, cancellationToken);

      if (user is null)
      {
        throw new ArgumentException("User with this email does not exist.", nameof(request.EditorEmail));
      }

      editorUserId = user.Id;
    }

    var (result, dashboardTab) = DashboardTab.Create(request.Title, nextSequence, request.MapUrl, request.DropdownId, new List<InformationCard>(), _culture, editorUserId);
    result.ThrowIfFailure();

    await _dashboardRepository.SaveAsync(dashboardTab);

    return new CreateDashboardTabResponse();
  }
}
