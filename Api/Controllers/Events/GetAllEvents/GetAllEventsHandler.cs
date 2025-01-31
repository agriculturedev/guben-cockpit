using Api.Controllers.Events.Shared;
using Domain.Events.repository;
using Shared.Api;
using Api.Shared;

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
    var filter = new EventFilterCriteria
    {
      TitleQuery = request.TitleSearch,
      LocationQuery = request.LocationSearch,
      CategoryIdQuery = request.CategoryId,
      StartDateQuery = request.StartDate,
      EndDateQuery = request.EndDate,
      SortBy = request.SortBy?.MapToDomain(),
      SortDirection = request.SortDirection?.MapToDomain(),
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
