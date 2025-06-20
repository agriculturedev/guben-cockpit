using System.Net.Mime;
using Api.Controllers.Geo.AddTopic;
using Api.Controllers.Geo.GetTopics;
using Api.Controllers.Geo.UploadWfs;
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

  [HttpPost("topics")]
  [EndpointName("AddTopics")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(AddTopicsResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> AddTopics([FromBody] AddTopicsQuery query)
  {
    var result = await _mediator.Send(query);
    return Results.Ok(result);
  }

  [HttpPost("wfs")]
  [EndpointName("GeoUploadWfs")]
  [Authorize]
  [Consumes("multipart/form-data")]
  public async Task<IResult> CreateWfsFile([FromQuery] bool isPublic, IFormFile file)
  {
    if (file == null || file.Length == 0)
      return Results.BadRequest("No file content provided.");

    var result = await _mediator.Send(new UploadWfsQuery()
    {
      IsPublic = isPublic,
      File = file
    });
    return Results.Ok(result);
  }
}
