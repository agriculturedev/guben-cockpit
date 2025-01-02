using System.Net.Mime;
using System.Security.Claims;
using Api.Controllers.Users.CreateUser;
using Api.Controllers.Users.GetAllUsers;
using Api.Controllers.Users.GetUser;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.Users;

/// <summary>
/// Controller for managing users
/// </summary>
[ApiController]
[Route("api/users")]
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
  /// <response code="200">Returns all users.</response>
  /// <response code="400">Server cannot/will not process the request due to perceiving a client error. (Bad Request)</response>
  [HttpGet]
  [EndpointName("UsersGetAll")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetAllUsersResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> GetAll()
  {
    // Extract the "sub" claim which represents the Keycloak user ID
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Standard claim type
    if (userId == null)
    {
      return Results.Unauthorized();
    }

    var result = await _mediator.Send(new GetAllUsersQuery());
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
  /// Creates a new user
  /// </summary>
  /// <response code="201">User has been created.</response>
  /// <response code="400">Server cannot/will not process the request due to perceiving a client error. (Bad Request)</response>
  [HttpPost]
  [EndpointName("UsersCreateUser")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CreateUserResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> CreateUser([FromBody] CreateUserQuery request)
  {
    var result = await _mediator.Send(request);
    return Results.Ok(result);
  }
}
