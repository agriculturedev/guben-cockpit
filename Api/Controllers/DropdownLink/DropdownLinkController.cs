using System.Net.Mime;
using Api.Controllers.DropdownLink.CreateDropdownLink;
using Api.Controllers.DropdownLink.DeleteDropdownLink;
using Api.Controllers.DropdownLink.EditDropdownLink;
using Api.Infrastructure.Keycloak;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.DropdownLink;

/// <summary>
/// Controller for managing dropdown links
/// </summary>
[ApiController]
[Route("dropdownlink")]
[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
public class DropdownLinkController : ControllerBase
{
    private readonly IMediator _mediator;

    public DropdownLinkController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    [Authorize(KeycloakPolicies.DashboardManager)]
    [EndpointName("DropdownLinkCreate")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CreateDropdownLinkResponse))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IResult> Create([FromBody] CreateDropdownLinkQuery request)
    {
        var result = await _mediator.Send(request);
        return Results.Ok(result);
    }

    [HttpPut]
    [Authorize(KeycloakPolicies.DashboardManager)]
    [EndpointName("DropdownLinkEdit")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(EditDropdownLinkResponse))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IResult> Edit(EditDropdownLinkQuery request)
    {
        var result = await _mediator.Send(request);
        return Results.Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(KeycloakPolicies.DashboardManager)]
    [EndpointName("DropdownLinkDelete")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DeleteDropdownLinkResponse))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IResult> Delete([FromRoute] Guid id)
    {
        var result = await _mediator.Send(new DeleteDropdownLinkQuery { Id = id });
        return Results.Ok(result);
    }
}
