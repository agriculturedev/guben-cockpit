using System.Net.Mime;
using Api.Controllers.Projects.CreateProject;
using Api.Controllers.Projects.DeleteProject;
using Api.Controllers.Projects.GetAllBusinesses;
using Api.Controllers.Projects.GetAllNonBusinesses;
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

  [HttpGet("businsesses")]
  [EndpointName("ProjectsGetAllBusinesses")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetAllBusinessesResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> GetAll([FromQuery] GetallBusinessesQuery query)
  {
    var result = await _mediator.Send(query);
    return Results.Ok(result);
  }

  [HttpGet("projects")]
  [EndpointName("ProjectsGetAllNonBusinesses")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetAllNonBusinessesResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> GetAllHighlighted()
  {
    var result = await _mediator.Send(new GetAllNonBusinessesQuery());
    return Results.Ok(result);
  }

  [HttpGet("owned")]
  [EndpointName("ProjectsGetMyProjects")]
  [Authorize(KeycloakPolicies.ProjectContributor)]
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
  [Authorize(KeycloakPolicies.ProjectContributor)]
  [EndpointName("ProjectsCreateProject")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CreateProjectResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> CreateProject([FromBody] CreateProjectQuery query)
  {
    var result = await _mediator.Send(query);
    return Results.Ok(result);
  }

  [HttpPut("{id}")]
  [Authorize(KeycloakPolicies.ProjectContributor)]
  [EndpointName("ProjectsUpdateProject")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CreateProjectResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> UpdateProjects([FromRoute] string id, [FromBody] UpdateProjectQuery query)
  {
    query.SetId(id);
    var result = await _mediator.Send(query);
    return Results.Ok(result);
  }

  [HttpDelete("{id}")]
  [Authorize(KeycloakPolicies.ProjectContributor)]
  [EndpointName("ProjectsDeleteProject")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DeleteProjectResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> DeleteProject([FromRoute] string id)
  {
    var query = new DeleteProjectQuery { Id = id };
    var result = await _mediator.Send(query);
    return Results.Ok(result);
  }
}
