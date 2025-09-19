using System.Net.Mime;
using Api.Controllers.DashboardTabs.AddCardToTab;
using Api.Controllers.DashboardTabs.CreateDashboardTab;
using Api.Controllers.DashboardTabs.DeleteCardFromTab;
using Api.Controllers.DashboardTabs.DeleteDashboardTab;
using Api.Controllers.DashboardTabs.GetAllDashboardTabs;
using Api.Controllers.DashboardTabs.UpdateCardOnTab;
using Api.Controllers.DashboardTabs.UpdateCardSequence;
using Api.Controllers.DashboardTabs.UpdateDashboardTab;
using Api.Infrastructure.Keycloak;
using MediatR;
using Microsoft.AspNetCore.Authorization;
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
  [Authorize(KeycloakPolicies.DashboardManager)]
  [EndpointName("DashboardUpdate")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UpdateDashboardTabResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> Update([FromBody] UpdateDashboardTabQuery request)
  {
    var result = await _mediator.Send(request);
    return Results.Ok(result);
  }

  [HttpPost]
  [Authorize(KeycloakPolicies.DashboardManager)]
  [EndpointName("DashboardCreate")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CreateDashboardTabResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> Create([FromBody] CreateDashboardTabQuery request)
  {
    var result = await _mediator.Send(request);
    return Results.Ok(result);
  }

  [HttpDelete("{id:guid}")]
  [Authorize(KeycloakPolicies.DashboardManager)]
  [EndpointName("DashboardDelete")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DeleteDashboardTabResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> Delete([FromRoute] Guid id)
  {
    var result = await _mediator.Send(new DeleteDashboardTabQuery { Id = id });
    return Results.Ok(result);
  }

  [HttpPost("{id:guid}/card")]
  [Authorize(Roles = $"{KeycloakPolicies.DashboardManager},{KeycloakPolicies.DashboardEditor}")]
  [EndpointName("DashboardCreateCard")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(AddCardToTabResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> CreateCard([FromBody] AddCardToTabQuery request, [FromRoute] Guid id)
  {
    request.TabId = id;
    var result = await _mediator.Send(request);
    return Results.Ok(result);
  }

  [HttpPut("{id:guid}/card/{cardId:guid}")]
  [Authorize(Roles = $"{KeycloakPolicies.DashboardManager},{KeycloakPolicies.DashboardEditor}")]
  [EndpointName("DashboardCardUpdate")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UpdateCardOnTabResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> UpdateCard([FromBody] UpdateCardOnTabQuery request, [FromRoute] Guid id, [FromRoute] Guid cardId)
  {
    request.CardId = cardId;
    request.TabId = id;
    var result = await _mediator.Send(request);
    return Results.Ok(result);
  }


  [HttpDelete("{id:guid}/card/{cardId:guid}")]
  [Authorize(Roles = $"{KeycloakPolicies.DashboardManager},{KeycloakPolicies.DashboardEditor}")]
  [EndpointName("DashboardCardDelete")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DeleteCardFromTabResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> DeleteCard([FromRoute] Guid id, [FromRoute] Guid cardId)
  {
    var result = await _mediator.Send(new DeleteCardFromTabQuery() { Id = id, CardId = cardId });
    return Results.Ok(result);
  }

  [HttpPut("{id:guid}/card/reorder")]
  [Authorize(Roles = $"{KeycloakPolicies.DashboardManager},{KeycloakPolicies.DashboardEditor}")]
  [EndpointName("DashboardCardReorder")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UpdateCardSequenceResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> ReorderCards([FromRoute] Guid id, [FromBody] UpdateCardSequenceQuery request)
  {
    request.TabId = id;
    var result = await _mediator.Send(request);
    return Results.Ok(result);
  }
}
