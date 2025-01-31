using System.Net.Mime;
using Api.Controllers.DashboardTabs.CreateDashboardTab;
using Api.Controllers.DashboardTabs.DeleteDashboardTab;
using Api.Controllers.DashboardTabs.GetAllDashboardTabs;
using Api.Controllers.DashboardTabs.UpdateDashboardTab;
using Database.Migrations;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.DashboardTabs;

/// <summary>
/// Controller for managing dashboard
/// </summary>
[ApiController]
[Route("dashboard")]
[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
public class DashboardTabsController : ControllerBase
{
  private readonly IMediator _mediator;

  public DashboardTabsController(IMediator mediator)
  {
    _mediator = mediator;
  }

  [HttpGet]
  [EndpointName("DashboardGetAll")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetAllDashboardTabsResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> GetAll()
  {
    var result = await _mediator.Send(new GetAllDashboardTabsQuery());
    return Results.Ok(result);
  }

  [HttpPut]
  [EndpointName("DashboardUpdate")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UpdateDashboardTabResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> Update([FromBody] UpdateDashboardTabQuery request)
  {
    var result = await _mediator.Send(request);
    return Results.Ok(result);
  }

  [HttpPost]
  [EndpointName("DashboardCreate")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CreateDashboardTabResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> Create([FromBody] CreateDashboardTabQuery request)
  {
    var result = await _mediator.Send(request);
    return Results.Ok(result);
  }

  [HttpDelete("{id:guid}")]
  [EndpointName("DashboardDelete")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DeleteDashboardTabResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> Delete([FromRoute] Guid id)
  {
    var result = await _mediator.Send(new DeleteDashboardTabQuery { Id = id });
    return Results.Ok(result);
  }
}
