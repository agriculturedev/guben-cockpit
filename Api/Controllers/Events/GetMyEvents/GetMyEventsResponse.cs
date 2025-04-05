using Api.Controllers.Events.Shared;
using Shared.Api.Pagination;

namespace Api.Controllers.Events.GetMyEvents;

public struct GetMyEventsResponse
{
  public required IEnumerable<EventResponse> Results {get; init;}
}
