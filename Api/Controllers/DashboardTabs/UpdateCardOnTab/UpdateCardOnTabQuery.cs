using Api.Controllers.DashboardTabs.Shared;
using Shared.Api;

namespace Api.Controllers.DashboardTabs.UpdateCardOnTab;

public class UpdateCardOnTabQuery : UpdateCardQuery, IAuthenticatedApiRequest, IApiRequest<UpdateCardOnTabResponse>
{

}
