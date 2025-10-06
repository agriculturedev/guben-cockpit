using Shared.Api;

namespace Api.Controllers.DashboardTabs.UpdateSequences;

public class UpdateSequencesQuery : IAuthenticatedApiRequest, IApiRequest<UpdateSequencesResponse>
{
  public Guid DropdownId { get; set; }
  public List<Guid> OrderedTabIds { get; set; } = [];
}
