using System.Net.Mime;
using Api.Controllers.DashboardDropdown.CreateDashboardDropdown;
using Api.Controllers.DashboardDropdown.DeleteDashboardDropdown;
using Api.Controllers.DashboardDropdown.GetAllDashboardDropdown;
using Api.Infrastructure.Keycloak;
using MediatR;
using Microsoft.AspNetCore.Authorization;
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
    [Authorize(KeycloakPolicies.DashboardManager)]
    [EndpointName("DashboardDropdownCreate")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CreateDashboardDropdownResponse))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IResult> Create([FromBody] CreateDashboardDropdownQuery request)
    {
        var result = await _mediator.Send(request);
        return Results.Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(KeycloakPolicies.DashboardManager)]
    [EndpointName("DashboardDropdownDelete")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DeleteDashboardDropdownResponse))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IResult> Delete([FromRoute] Guid id)
    {
        var result = await _mediator.Send(new DeleteDashboardDropdownQuery { Id = id });
        return Results.Ok(result);
    }
}