using Domain;
using Domain.DashboardDropdown.repository;
using Shared.Api;

namespace Api.Controllers.DashboardDropdown.DeleteDashboardDropdown;

public class DeleteDashboardDropdownHandler : ApiRequestHandler<DeleteDashboardDropdownQuery, DeleteDashboardDropdownResponse>
{
  private readonly IDashboardDropdownRepository _dashboardDropdownRepository;

  public DeleteDashboardDropdownHandler(IDashboardDropdownRepository dashboardDropdownRepository)
  {
    _dashboardDropdownRepository = dashboardDropdownRepository;
  }

  public override async Task<DeleteDashboardDropdownResponse> Handle(DeleteDashboardDropdownQuery request, CancellationToken cancellationToken)
  {
    var dashboardDropdownToDelete = await _dashboardDropdownRepository.Get(request.Id);
    if (dashboardDropdownToDelete is null)
      throw new ProblemDetailsException(TranslationKeys.DashboardTabNotFound);

    _dashboardDropdownRepository.Delete(dashboardDropdownToDelete);

    return new DeleteDashboardDropdownResponse();
  }
}