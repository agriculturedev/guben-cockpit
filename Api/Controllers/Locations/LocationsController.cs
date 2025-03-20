using System.Net.Mime;
using Api.Controllers.Locations.Createlocation;
using Api.Controllers.Locations.GetAllLocations;
using Api.Controllers.Locations.GetAllLocationsPaged;
using Api.Infrastructure.Keycloak;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.Locations;

/// <summary>
/// Controller for managing locations
/// </summary>
[ApiController]
[Route("locations")]
[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
public class LocationsController : ControllerBase
{
  private readonly IMediator _mediator;

  public LocationsController(IMediator mediator)
  {
    _mediator = mediator;
  }

  [HttpGet]
  [EndpointName("LocationsGetAll")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetAllLocationsResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> GetAll()
  {
    var result = await _mediator.Send(new GetAllLocationsQuery());
    return Results.Ok(result);
  }

  [HttpGet("paged")]
  [EndpointName("LocationsGetAllPaged")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetAllLocationsPagedResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> GetAllPaged([FromQuery] GetAllLocationsPagedQuery query)
  {
    var result = await _mediator.Send(query);
    return Results.Ok(result);
  }

  [HttpPost]
  [EndpointName("LocationsCreate")]
  [Authorize(KeycloakPolicies.LocationManager)]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CreateLocationResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> Create([FromBody] CreateLocationQuery query)
  {
    var result = await _mediator.Send(query);
    return Results.Ok(result);
  }
}
