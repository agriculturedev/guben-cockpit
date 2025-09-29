using System.Net.Mime;
using Api.Controllers.MasterportalLinks.CreateMasterportalLink;
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

    [HttpPost]
    [Authorize(KeycloakPolicies.DashboardManager)]
    [EndpointName("MasterportalLinksCreate")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CreateMasterportalLinkResponse))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IResult> Create([FromBody] CreateMasterportalLinkQuery request)
    {
        var result = await _mediator.Send(request);
        return Results.Ok(result);
    }
}