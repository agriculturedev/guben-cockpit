using System.Net.Mime;
using Api.Controllers.Locations.GetAllLocations;
using MediatR;
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

  [HttpPost]
  [EndpointName("LocationsGetOrCreate")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetAllLocationsResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> GetOrCreate()
  {
    var result = await _mediator.Send(new GetAllLocationsQuery());
    return Results.Ok(result);
  }
}
