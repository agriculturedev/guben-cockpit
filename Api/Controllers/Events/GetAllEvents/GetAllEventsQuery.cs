using Shared.Api;
using Shared.Api.Pagination;

namespace Api.Controllers.Events.GetAllEvents;

public class GetAllEventsQuery : PagedQuery, IApiRequest<GetAllEventsResponse>
{
  public string? TitleSearch { get; set; }
  public string? LocationSearch { get; set; }
  public Guid? CategoryId { get; set; }
  public DateOnly? StartDate { get; set; }
  public DateOnly? EndDate { get; set; }

}
