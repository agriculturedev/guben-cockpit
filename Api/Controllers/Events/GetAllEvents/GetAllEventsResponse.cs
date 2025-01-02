using Api.Controllers.Events.Shared;

namespace Api.Controllers.Events.GetAllEvents;

public class GetAllEventsResponse
{
  public required IEnumerable<EventResponse> Events { get; set; }
}
