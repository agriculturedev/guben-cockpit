using System.Net.Mime;
using Api.Controllers.Events.CreateEvent;
using Api.Controllers.Events.GetAllEvents;
using Api.Controllers.Events.Shared;
using Api.Shared;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Api.Pagination;

namespace Api.Controllers.Events;

/// <summary>
/// Controller for managing events
/// </summary>
[ApiController]
[Route("events")]
[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
public class EventController : ControllerBase
{
  private readonly IMediator _mediator;

  public EventController(IMediator mediator)
  {
    _mediator = mediator;
  }

  [HttpGet]
  [EndpointName("EventsGetAll")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetAllEventsResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> GetAll([FromQuery] string? title, [FromQuery] string? location, [FromQuery] Guid?
    categoryId, [FromQuery] DateOnly? startDate, [FromQuery] DateOnly? endDate, [FromQuery] EventSortOption sortBy, [FromQuery] SortDirection sortDirection, [FromQuery] int
    pageNumber = PagedQuery.DefaultPageNumber, [FromQuery] int pageSize = PagedQuery.DefaultPageSize)
  {
    var result = await _mediator.Send(new GetAllEventsQuery()
    {
      TitleSearch = title,
      LocationSearch = location,
      CategoryId = categoryId,
      StartDate = startDate,
      EndDate = endDate,
      SortBy = sortBy,
      SortDirection = sortDirection,
      PageNumber = pageNumber,
      PageSize = pageSize
    });
    return Results.Ok(result);
  }

  // [HttpGet("{keycloakId}")]
  // [EndpointName("EventsGet")]
  // [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetEventResponse))]
  // [ProducesResponseType(StatusCodes.Status400BadRequest)]
  // public async Task<IResult> Get([FromRoute] string eventId)
  // {
  //   var result = await _mediator.Send(new GetEventQuery()
  //   {
  //     EventId = eventId
  //   });
  //   return Results.Ok(result);
  // }

  [HttpPost]
  [Authorize]
  [EndpointName("EventsCreateEvent")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CreateEventResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> CreateEvent([FromBody] CreateEventQuery request)
  {
    var result = await _mediator.Send(request);
    return Results.Ok(result);
  }
}
