using System.Net.Mime;
using Api.Controllers.Geo.AddTopic;
using Api.Controllers.Geo.GetGeoDataSources;
using Api.Controllers.Geo.GetTopics;
using Api.Controllers.Geo.UploadWfs;
using Api.Controllers.Geo.ValidateGeoDataSource;
using Domain;
using Domain.GeoDataSource;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Api;

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

  [HttpPost("geodata/upload")]
  [EndpointName("GeoUploadGeoDataSource")]
  [Authorize]
  [Consumes("multipart/form-data")]
  public async Task<IResult> CreateGeoDataFile([FromBody] UploadWfsQuery query)
  {
    if (query.File == null || query.File.Length == 0)
      return Results.BadRequest("No file content provided.");

    if (!GeoDataSourceType.TryFromValue(query.Type, out var castType))
      throw new ProblemDetailsException(TranslationKeys.GeoDataSourceTypeInvalid);

    var result = await _mediator.Send(new UploadWfsQuery()
    {
      IsPublic = query.IsPublic,
      File = query.File,
      Type = castType
    });

    return Results.Ok(result);
  }

  [HttpGet("geodata")]
  [EndpointName("GeoGetAllGeoDataSources")]
  [Authorize]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetGeoDataSourcesResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> GetAllGeoDataSources()
  {
    var result = await _mediator.Send(new GetGeoDataSourcesQuery());
    return Results.Ok(result);
  }



  [HttpPatch("validate/{Id:guid}")]
  [EndpointName("GeoValidate")]
  [Authorize] // TODO@JOREN: new role for data protection officer
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ValidateGeoDataSourceResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> ValidateGeoDataSource([FromRoute] Guid id, [FromBody] bool isValid)
  {
    var result = await _mediator.Send(new ValidateGeoDataSourceQuery()
    {
      Id = id,
      IsValid = isValid
    });
    return Results.Ok(result);
  }
}
