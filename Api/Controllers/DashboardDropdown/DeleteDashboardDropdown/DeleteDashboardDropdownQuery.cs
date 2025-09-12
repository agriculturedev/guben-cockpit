using Shared.Api;

namespace Api.Controllers.DashboardDropdown.DeleteDashboardDropdown;

public class DeleteDashboardDropdownQuery : IAuthenticatedApiRequest, IApiRequest<DeleteDashboardDropdownResponse>
{
  public required Guid Id { get; set; }
}