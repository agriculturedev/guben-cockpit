using System.Net.Mime;
using Api.Controllers.Geo.AddTopic;
using Api.Controllers.Geo.GetTopics;
using MediatR;
using Microsoft.AspNetCore.Authorization;
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
  [EndpointName("GetTopics")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetTopicsResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> GetTopics()
  {
    var result = await _mediator.Send(new GetTopicsQuery());
    return Results.Ok(result);
  }

  // For now the same as the Topics above. Until the Geoupload is added or when we have private data
  [HttpGet("topicsPrivate")]
  [EndpointName("GetTopicsPrivate")]
  [Authorize(Policy = "OnlyResiFormClient")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetTopicsResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> GetTopicsPrivate()
  {
    var result = await _mediator.Send(new GetTopicsQuery());
    return Results.Ok(result);
  }

  [HttpPost("topics")]
  [EndpointName("AddTopics")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(AddTopicsResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> AddTopics([FromBody] AddTopicsQuery query)
  {
    var result = await _mediator.Send(query);
    return Results.Ok(result);
  }
}
