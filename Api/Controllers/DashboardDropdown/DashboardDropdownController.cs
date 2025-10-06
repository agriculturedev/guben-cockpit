using System.Net.Mime;
using Api.Controllers.DashboardDropdown.CreateDashboardDropdown;
using Api.Controllers.DashboardDropdown.DeleteDashboardDropdown;
using Api.Controllers.DashboardDropdown.GetAllDashboardDropdown;
using Api.Controllers.DashboardDropdown.GetMyDashboardDropdown;
using Api.Controllers.DashboardDropdown.UpdateDashboardDropdown;
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

    [HttpGet("all")]
    [EndpointName("DashboardDropdownGetAll")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetAllDashboardDropdownResponse))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IResult> GetAll()
    {
        var result = await _mediator.Send(new GetAllDashboardDropdownQuery());
        return Results.Ok(result);
    }

    [HttpGet("my")]
    [Authorize(Roles = $"{KeycloakPolicies.DashboardManager},{KeycloakPolicies.DashboardEditor}")]
    [EndpointName("DashbaordDropdownGetMy")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetMyDashboardDropdownResponse))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IResult> GetMy()
    {
        var result = await _mediator.Send(new GetMyDashboardDropdownQuery());
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

    [HttpPut("{id}")]
    [Authorize(KeycloakPolicies.DashboardManager)]
    [EndpointName("DashboardDropdownUpdate")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UpdateDashboardDropdownResponse))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IResult> Update([FromRoute] Guid id, [FromBody] UpdateDashboardDropdownQuery query)
    {
        query.SetId(id);
        var result = await _mediator.Send(query);
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