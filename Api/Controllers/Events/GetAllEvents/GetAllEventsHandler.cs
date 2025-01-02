using Api.Controllers.Events.Shared;
using Domain.Events.repository;
using Shared.Api;

namespace Api.Controllers.Events.GetAllEvents;

public class GetAllEventsHandler : ApiRequestHandler<GetAllEventsQuery, GetAllEventsResponse>
{
  private readonly IEventRepository _eventRepository;

  public GetAllEventsHandler(IEventRepository eventRepository)
  {
    _eventRepository = eventRepository;
  }

  public override  Task<GetAllEventsResponse> Handle(GetAllEventsQuery request, CancellationToken
      cancellationToken)
  {
    var events = _eventRepository.GetAllEvents();

    if (request.TitleSearch is not null)
      events = events
        .Where(e => e.Title.Contains(request.TitleSearch));

    if (request.LocationSearch is not null)
      events = events
        .Where(e => e.Location.Name.Contains(request.LocationSearch)
                    || (e.Location.City != null && e.Location.City.Contains(request.LocationSearch)));

    return Task.FromResult(new GetAllEventsResponse
    {
      Events = events.Select(EventResponse.Map).ToList()
    });
  }
}
