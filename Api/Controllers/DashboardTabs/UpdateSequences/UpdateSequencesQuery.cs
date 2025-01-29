using Shared.Api;

namespace Api.Controllers.DashboardTabs.UpdateSequences;

public class UpdateSequencesQuery : IAuthenticatedApiRequest, IApiRequest<UpdateSequencesResponse>
{
  public List<UpdateTabSequenceQuery> Sequences { get; set; }
}

public class UpdateTabSequenceQuery
{
  public Guid TabId { get; set; }
  public int Sequence { get; set; }
}
