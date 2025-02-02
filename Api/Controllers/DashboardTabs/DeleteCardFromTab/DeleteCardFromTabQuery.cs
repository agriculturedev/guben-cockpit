using Shared.Api;

namespace Api.Controllers.DashboardTabs.DeleteCardFromTab;

public class DeleteCardFromTabQuery : IAuthenticatedApiRequest, IApiRequest<DeleteCardFromTabResponse>
{
  public required Guid Id { get; set; }
  public required Guid CardId { get; set; }

}
