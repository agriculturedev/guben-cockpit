using Api.Controllers.Events.Shared;

namespace Api.Controllers.Events.GetEventById;

public struct GetEventByIdResponse {
  public EventResponse Result { get; init; }
}
