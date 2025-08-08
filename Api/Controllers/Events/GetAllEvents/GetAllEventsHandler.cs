using System.Globalization;
using Api.Controllers.Events.Shared;
using Api.Shared;
using Domain.Events.repository;
using Shared.Api;

namespace Api.Controllers.Events.GetAllEvents;

public class GetAllEventsHandler : ApiPagedRequestHandler<GetAllEventsQuery, GetAllEventsResponse, EventResponse>
{
  private readonly IEventRepository _eventRepository;
  private readonly CultureInfo _culture;

  public GetAllEventsHandler(IEventRepository eventRepository)
  {
    _eventRepository = eventRepository;
    _culture = CultureInfo.CurrentCulture;
  }

  public override async Task<GetAllEventsResponse> Handle(GetAllEventsQuery request, CancellationToken
      cancellationToken)
  {

    var filter = new EventFilterCriteria
    {
      TitleQuery = request.TitleSearch,
      DistanceInKm = request.DistanceInKm,
      CategoryIdQuery = request.CategoryId,
      StartDateQuery = request.StartDate,
      EndDateQuery = request.EndDate,
      SortBy = request.SortBy?.MapToDomain(),
      SortDirection = request.SortDirection?.MapToDomain(),
    };

    var pagedResult = await _eventRepository.GetAllEventsPaged(request, filter, _culture);

    return new GetAllEventsResponse
    {
      PageNumber = pagedResult.PageNumber,
      PageSize = pagedResult.PageSize,
      TotalCount = pagedResult.TotalCount,
      PageCount = pagedResult.PageCount,
      Results = pagedResult.Results.Select(e => EventResponse.Map(e, _culture))
    };
  }
}
