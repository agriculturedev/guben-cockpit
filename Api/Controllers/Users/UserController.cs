using System.Net.Mime;
using Api.Controllers.Users.GetAllUsers;
using Api.Controllers.Users.GetMe;
using Api.Controllers.Users.GetUser;
using Api.Infrastructure.Keycloak;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Api.Pagination;

namespace Api.Controllers.Users;

/// <summary>
/// Controller for managing users
/// </summary>
[ApiController]
[Route("users")]
[Authorize]
[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
public class UserController : ControllerBase
{
  private readonly IMediator _mediator;

  public UserController(IMediator mediator)
  {
    _mediator = mediator;
  }

  /// <summary>
  /// Returns all users
  /// </summary>
  /// <param name="pageNumber"></param>
  /// <param name="pageSize"></param>
  /// <response code="200">Returns all users.</response>
  /// <response code="400">Server cannot/will not process the request due to perceiving a client error. (Bad Request)</response>
  [HttpGet]
  [Authorize(KeycloakPolicies.ViewUsers)]
  [EndpointName("UsersGetAll")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetAllUsersResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> GetAll([FromQuery] int pageNumber = PagedQuery.DefaultPageNumber, [FromQuery] int pageSize = PagedQuery.DefaultPageSize)
  {
    var result = await _mediator.Send(new GetAllUsersQuery()
    {
      PageNumber = pageNumber,
      PageSize = pageSize
    });
    return Results.Ok(result);
  }

  /// <summary>
  /// Returns one users
  /// </summary>
  /// <response code="200">Returns all users.</response>
  /// <response code="400">Server cannot/will not process the request due to perceiving a client error. (Bad Request)</response>
  [HttpGet("{keycloakId}")]
  [EndpointName("UsersGet")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetUserResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> Get([FromRoute] string keycloakId)
  {
    var result = await _mediator.Send(new GetUserQuery()
    {
      KeycloakId = keycloakId
    });
    return Results.Ok(result);
  }

  /// <summary>
  /// Returns logged in user
  /// </summary>
  /// <response code="200">Returns logged in user.</response>
  /// <response code="400">Server cannot/will not process the request due to perceiving a client error. (Bad Request)</response>
  [HttpGet("me")]
  [EndpointName("UsersGetMe")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetMeResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> GetMe()
  {
    var result = await _mediator.Send(new GetMeQuery()
    {
    });
    return Results.Ok(result);
  }
}
