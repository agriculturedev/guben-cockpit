using System.Net.Mime;
using Api.Controllers.Events.GetAllEvents;
using Api.Controllers.Projects.GetAllProjects;
using Api.Controllers.Projects.PublishProjects;
using Api.Controllers.Projects.UnpublishProjects;
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

  [HttpPut("Publish")]
  [EndpointName("ProjectsPublishProjects")]
  [Authorize(KeycloakPolicies.PublishProjects)]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(PublishProjectsResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> PublishProject([FromBody] List<string> projectIds)
  {
    var result = await _mediator.Send(new PublishProjectsQuery()
    {
      ProjectIds = projectIds,
    });
    return Results.Ok(result);
  }

  [HttpPut("Unpublish")]
  [EndpointName("ProjectsUnpublishProjects")]
  [Authorize(KeycloakPolicies.PublishProjects)]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UnpublishProjectsResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> UnpublishProject([FromBody] List<string> projectIds)
  {
    var result = await _mediator.Send(new UnpublishProjectsQuery()
    {
      ProjectIds = projectIds,
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
