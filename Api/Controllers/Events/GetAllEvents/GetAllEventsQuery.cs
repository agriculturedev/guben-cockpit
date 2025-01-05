using Shared.Api;
using Shared.Api.Pagination;

namespace Api.Controllers.Events.GetAllEvents;

public class GetAllEventsQuery : PagedQuery, IApiRequest<GetAllEventsResponse>
{
  public string? TitleSearch { get; set; }
  public string? LocationSearch { get; set; }
}
