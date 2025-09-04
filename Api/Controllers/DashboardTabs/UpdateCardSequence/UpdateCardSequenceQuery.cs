using Shared.Api;

namespace Api.Controllers.DashboardTabs.UpdateCardSequence;

public class UpdateCardSequenceQuery : IAuthenticatedApiRequest, IApiRequest<UpdateCardSequenceResponse>
{
    public Guid TabId { get; set; }
    public List<Guid> OrderedCardIds { get; set; } = new();
}