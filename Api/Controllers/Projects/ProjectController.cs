using System.Net.Mime;
using Api.Controllers.Events.GetAllEvents;
using Api.Controllers.Projects.GetAllProjects;
using Api.Infrastructure.Keycloak;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.Projects;

/// <summary>
/// Controller for managing events
/// </summary>
[ApiController]
[Route("projects")]
[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
public class ProjectController : ControllerBase
{
  private readonly IMediator _mediator;

  public ProjectController(IMediator mediator)
  {
    _mediator = mediator;
  }

  [HttpGet]
  [EndpointName("ProjectsGetAll")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetAllProjectsResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> GetAll()
  {
    var result = await _mediator.Send(new GetAllProjectsQuery());
    return Results.Ok(result);
  }

  [HttpPost]
  [EndpointName("ProjectsPublish")]
  [Authorize(KeycloakPolicies.PublishProjects)]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetAllProjectsResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> PublishProject()
  {
    var result = await _mediator.Send(new GetAllProjectsQuery());
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
