using System.Net.Mime;
using Api.Controllers.Events.CreateEvent;
using Api.Controllers.Events.DeleteEvent;
using Api.Controllers.Events.GetAllEvents;
using Api.Controllers.Events.GetEventById;
using Api.Controllers.Events.GetMyEvents;
using Api.Infrastructure.Keycloak;
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
  public async Task<IResult> GetAll([FromQuery] GetAllEventsQuery query)
  {
    var result = await _mediator.Send(query);
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

  [HttpGet("owned")]
  [EndpointName("EventsGetMyEvents")]
  [Authorize(KeycloakPolicies.EventContributor)]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetMyEventsResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> GetMyEvents([FromQuery] GetMyEventsQuery query)
  {
    var result = await _mediator.Send(query);
    return Results.Ok(result);
  }

  [HttpPost]
  [Authorize(KeycloakPolicies.EventContributor)]
  [EndpointName("EventsCreateEvent")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CreateEventResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> CreateEvent([FromBody] CreateEventQuery request)
  {
    var result = await _mediator.Send(request);
    return Results.Ok(result);
  }

  [HttpDelete("{id:guid}")]
  // TODO@JOREN: add 'eventAdmin' check, this person can delete other people's events too
  [Authorize(KeycloakPolicies.EventContributor)] // can only delete his/her own events
  [EndpointName("EventsDeleteEvent")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DeleteEventResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> CreateEvent([FromRoute] Guid id)
  {
    var result = await _mediator.Send(new DeleteEventQuery()
    {
      Id = id
    });
    return Results.Ok(result);
  }

  [HttpGet("{id:guid}")]
  [EndpointName("EventsGetById")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetEventByIdResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> GetEventById([FromRoute] Guid id)
  {
    var result = await _mediator.Send(new GetEventByIdQuery(id));
    return Results.Ok(result);
  }
}
