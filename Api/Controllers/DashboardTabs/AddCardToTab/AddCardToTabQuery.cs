using Api.Controllers.DashboardTabs.Shared;
using Shared.Api;

namespace Api.Controllers.DashboardTabs.AddCardToTab;

public class AddCardToTabQuery : AddCardQuery, IAuthenticatedApiRequest, IApiRequest<AddCardToTabResponse>
{
}
