using Shared.Api;

namespace Api.Controllers.DashboardDropdown.CreateDashboardDropdown;

public class CreateDashboardDropdownQuery : IAuthenticatedApiRequest, IApiRequest<CreateDashboardDropdownResponse>
{
    public required string Title { get; set; }
    public bool IsLink { get; set; }
}
