using System.Net.Mime;
using System.Security.Claims;
using Api.Controllers.Events.GetAllEvents;
using Domain.Events;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
  public async Task<IResult> GetAll()
  {
    var result = await _mediator.Send(new GetAllEventsQuery());
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


  // [HttpPost]
  // [Authorize]
  // [EndpointName("EventsCreateEvent")]
  // [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CreateEventResponse))]
  // [ProducesResponseType(StatusCodes.Status400BadRequest)]
  // public async Task<IResult> CreateEvent([FromBody] CreateEventQuery request)
  // {
  //   var result = await _mediator.Send(request);
  //   return Results.Ok(result);
  // }
}
