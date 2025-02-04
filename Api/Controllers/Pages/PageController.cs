﻿using System.Net.Mime;
using Api.Controllers.Events.CreateEvent;
using Api.Controllers.Events.GetAllEvents;
using Api.Controllers.Events.Shared;
using Api.Controllers.Pages.GetPage;
using Api.Controllers.Pages.Shared;
using Api.Controllers.Pages.UpdatePage;
using Api.Shared;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Api.Pagination;

namespace Api.Controllers.Pages;

/// <summary>
/// Controller for managing pages
/// </summary>
[ApiController]
[Route("pages")]
[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
public class PageController : ControllerBase
{
  private readonly IMediator _mediator;

  public PageController(IMediator mediator)
  {
    _mediator = mediator;
  }

  [HttpGet]
  [EndpointName("PagesGetAll")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetAllEventsResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> GetAll()
  {
    var result = await _mediator.Send(new GetAllEventsQuery());
    return Results.Ok(result);
  }

  [HttpGet("${id}")]
  [EndpointName("PagesGet")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(PageResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> Get([FromRoute] string id)
  {
    var result = await _mediator.Send(new GetPageQuery()
    {
      Id = id
    });
    return Results.Ok(result);
  }

  [HttpPut("${id}")]
  [EndpointName("PagesUpdate")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UpdatePageResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> Update([FromBody] UpdatePageQuery query, [FromRoute] string id)
  {
    query.Id = id;
    var result = await _mediator.Send(query);
    return Results.Ok(result);
  }
}
