using System.Net.Mime;
using Api.Controllers.DashboardDropdown.CreateDashboardDropdown;
using Api.Controllers.DashboardDropdown.GetAllDashboardDropdown;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.DashboardDropdown;

/// <summary>
/// Controller for managing dashboard dropdown
/// </summary>
[ApiController]
[Route("dashboarddropdown")]
[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
public class DashbaordDropdownController : ControllerBase
{
    private readonly IMediator _mediator;

    public DashbaordDropdownController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [EndpointName("DashboardDropdownGetAll")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetAllDashboardDropdownResponse))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IResult> GetAll()
    {
        var result = await _mediator.Send(new GetAllDashboardDropdownQuery());
        return Results.Ok(result);
    }

    [HttpPost]
    [EndpointName("DashboardDropdownCreate")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CreateDashboardDropdownResponse))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IResult> Create([FromBody] CreateDashboardDropdownQuery request)
    {
        var result = await _mediator.Send(request);
        return Results.Ok(result);
    }
}