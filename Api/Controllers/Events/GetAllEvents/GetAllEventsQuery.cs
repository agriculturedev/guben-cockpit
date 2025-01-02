using Shared.Api;

namespace Api.Controllers.Events.GetAllEvents;

public class GetAllEventsQuery : IApiRequest<GetAllEventsResponse>
{
  public string? TitleSearch { get; set; }
  public string? LocationSearch { get; set; }
}
