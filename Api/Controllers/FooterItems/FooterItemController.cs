using System.Net.Mime;
using Api.Controllers.FooterItems.DeleteFooterItem;
using Api.Controllers.FooterItems.GetAllFooterItems;
using Api.Controllers.FooterItems.UpsertFooterItem;
using Api.Infrastructure.Keycloak;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.FooterItems;

/// <summary>
/// Controller for managing categories
/// </summary>
[ApiController]
[Route("footeritem")]
[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
public class FooterItemController : ControllerBase
{
  private readonly IMediator _mediator;

  public FooterItemController(IMediator mediator)
  {
    _mediator = mediator;
  }

  [HttpGet]
  [EndpointName("FooterItemsGetAll")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetAllFooterItemsResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> GetAll()
  {
    var result = await _mediator.Send(new GetAllFooterItemsQuery());
    return Results.Ok(result);
  }

  [HttpPost]
  [Authorize(KeycloakPolicies.FooterManager)]
  [EndpointName("FooterUpsertItem")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UpsertFooterItemResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> UpsertItem([FromBody] UpsertFooterItemQuery request)
  {
    var result = await _mediator.Send(request);
    return Results.Ok(result);
  }

  [HttpDelete("{id:guid}")]

[Authorize(KeycloakPolicies.FooterManager)]
  [EndpointName("FooterDeleteItem")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DeleteFooterItemResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> UpsertItem([FromRoute] Guid id)
  {
    var result = await _mediator.Send(new DeleteFooterItemQuery()
      {
        Id = id
      });
    return Results.Ok(result);
  }

}
