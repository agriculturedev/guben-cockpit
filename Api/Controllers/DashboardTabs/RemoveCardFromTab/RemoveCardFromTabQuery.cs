using Shared.Api;

namespace Api.Controllers.DashboardTabs.RemoveCardFromTab;

public class RemoveCardFromTabQuery : IAuthenticatedApiRequest, IApiRequest<RemoveCardFromTabResponse>
{
  public required Guid Id { get; set; }
  public required Guid CardId { get; set; }

}
