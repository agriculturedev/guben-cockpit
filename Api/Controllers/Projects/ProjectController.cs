using System.Net.Mime;
using Api.Controllers.Projects.CreateProject;
using Api.Controllers.Projects.GetAllProjects;
using Api.Controllers.Projects.GetMyProjects;
using Api.Controllers.Projects.PublishProjects;
using Api.Controllers.Projects.UpdateProject;
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

  [HttpGet("owned")]
  [EndpointName("ProjectsGetMyProjects")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetMyProjectsResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> GetMyProjects([FromQuery] GetMyProjectsQuery query)
  {
    var result = await _mediator.Send(query);
    return Results.Ok(result);
  }

  [HttpPut("Publish")]
  [EndpointName("ProjectsPublishProjects")]
  [Authorize(KeycloakPolicies.PublishProjects)]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(PublishProjectsResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> PublishProject([FromBody] PublishProjectsQuery query)
  {
    var result = await _mediator.Send(query);
    return Results.Ok(result);
  }

  [HttpPost]
  [Authorize]
  [EndpointName("ProjectsCreateProject")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CreateProjectResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> CreateProject([FromBody] CreateProjectQuery query)
  {
    var result = await _mediator.Send(query);
    return Results.Ok(result);
  }

  [HttpPut("{id}")]
  [Authorize]
  [EndpointName("ProjectsUpdateProject")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CreateProjectResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> UpdateProjects([FromBody] UpdateProjectQuery query, [FromRoute] string id)
  {
    query.Id = id;
    var result = await _mediator.Send(query);
    return Results.Ok(result);
  }
}
