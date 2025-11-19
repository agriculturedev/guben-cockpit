using System.Net.Mime;
using Api.Controllers.MasterportalLinks.ApproveMasterportalLink;
using Api.Controllers.MasterportalLinks.CreateMasterportalLink;
using Api.Controllers.MasterportalLinks.GetAllMasterportalLinks;
using Api.Controllers.MasterportalLinks.GetMyMasterportalLinks;
using Api.Controllers.MasterportalLinks.RejectMasterportalLink;
using Api.Infrastructure.Keycloak;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.MasterportalLinks;

/// <summary>
/// Controller for managing masterportal links
/// </summary>
[ApiController]
[Route("masterportal-links")]
[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
public class MasterportalLinksController : ControllerBase
{
    private readonly IMediator _mediator;

    public MasterportalLinksController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [Authorize(KeycloakPolicies.MasterportalLinkManager)]
    [EndpointName("MasterportalLinksGetAll")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetAllMasterportalLinksResponse))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IResult> GetAll()
    {
        var result = await _mediator.Send(new GetAllMasterportalLinksQuery());
        return Results.Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = $"{KeycloakPolicies.MasterportalLinkManager},{KeycloakPolicies.MasterportalLinkEditor}")]
    [EndpointName("MasterportalLinksCreate")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CreateMasterportalLinkResponse))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IResult> Create([FromBody] CreateMasterportalLinkQuery request)
    {
        var result = await _mediator.Send(request);
        return Results.Ok(result);
    }

    [HttpGet("my")]
    [Authorize(KeycloakPolicies.MasterportalLinkEditor)]
    [EndpointName("MasterportalLinksGetMy")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetMyMasterportalLinksResponse))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IResult> GetMy()
    {
        var result = await _mediator.Send(new GetMyMasterportalLinksQuery());
        return Results.Ok(result);
    }

    [HttpPost("{id:guid}/approve")]
    [Authorize(KeycloakPolicies.MasterportalLinkManager)]
    [EndpointName("MasterportalLinksApprove")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ApproveMasterportalLinkResponse))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IResult> Approve([FromRoute] Guid id)
    {
        var result = await _mediator.Send(new ApproveMasterportalLinkQuery
        {
            Id = id
        });
        return Results.Ok(result);
    }

    [HttpPost("{id:guid}/reject")]
    [Authorize(KeycloakPolicies.MasterportalLinkManager)]
    [EndpointName("MasterportalLinksReject")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(RejectMasterportalLinkResponse))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IResult> Reject([FromRoute] Guid id)
    {
        var result = await _mediator.Send(new RejectMasterportalLinkQuery
        {
            Id = id
        });
        return Results.Ok(result);
    }
}