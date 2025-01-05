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

  public override async Task<GetAllEventsResponse> Handle(GetAllEventsQuery request, CancellationToken
      cancellationToken)
  {
    var filter = new EventFilterCriteria()
    {
      TitleQuery = request.TitleSearch,
      LocationQuery = request.LocationSearch,
    };

    var pagedResult = await _eventRepository.GetAllEventsPaged(request, filter);

    return new GetAllEventsResponse
    {
      PageNumber = pagedResult.PageNumber,
      PageSize = pagedResult.PageSize,
      TotalCount = pagedResult.TotalCount,
      PageCount = pagedResult.PageCount,
      Results = pagedResult.Results.Select(EventResponse.Map)
    };
  }
}
