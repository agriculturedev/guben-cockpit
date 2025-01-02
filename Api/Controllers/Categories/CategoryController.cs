using System.Net.Mime;
using Api.Controllers.Categories.GetAllCategories;
using Api.Controllers.Events.GetAllEvents;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.Categories;

/// <summary>
/// Controller for managing categories
/// </summary>
[ApiController]
[Route("categories")]
[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
public class CategoryController : ControllerBase
{
  private readonly IMediator _mediator;

  public CategoryController(IMediator mediator)
  {
    _mediator = mediator;
  }

  [HttpGet]
  [EndpointName("CategoriesGetAll")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetAllCategoriesResponse))]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> GetAll()
  {
    var result = await _mediator.Send(new GetAllCategoriesQuery());
    return Results.Ok(result);
  }
}
