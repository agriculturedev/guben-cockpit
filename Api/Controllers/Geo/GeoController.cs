using System.Net.Mime;
using Api.Controllers.Geo.GetTopics;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.Geo;

/// <summary>
/// Controller for managing geo data
/// </summary>
[ApiController]
[Route("geo")]
[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
public class GeoController : ControllerBase
{
  private readonly IMediator _mediator;

  public GeoController(IMediator mediator)
  {
    _mediator = mediator;
  }

  [HttpGet("topics")]
  [EndpointName("Topics")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetTopicsResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> GetTopics()
  {
    var result = await _mediator.Send(new GetTopicsQuery());
    return Results.Ok(result);
  }
}
