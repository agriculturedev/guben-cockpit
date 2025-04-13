using System.Net.Mime;
using Api.Controllers.FooterItems.GetAllFooterItems;
using MediatR;
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
}
