using Shared.Api;

namespace Api.Controllers.DashboardDropdown.UpdateDashboardDropdown;

public class UpdateDashboardDropdownQuery : IAuthenticatedApiRequest, IApiRequest<UpdateDashboardDropdownResponse>
{
    public Guid? Id { get; private set; }
    public required string Title { get; set; }

    public void SetId(Guid id) => Id = id; 
}