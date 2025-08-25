using System.Net.Mime;
using Api.Controllers.Bookings.CreateTenantId;
using Api.Controllers.Bookings.DeleteTenantId;
using Api.Controllers.Bookings.GetAllTenantIds;
using Api.Controllers.Projects.DeleteTenantId;
using Api.Infrastructure.Keycloak;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.Bookings;

[ApiController]
[Route("bookings")]
[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
public class BookingController : ControllerBase
{
	private readonly IMediator _mediator;

	public BookingController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpGet]
	[EndpointName("BookingGetAllTenantIds")]
	[ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetAllTenantIdsResponse))]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	public async Task<IResult> GetAllTenantIds()
	{
		var result = await _mediator.Send(new GetAllTenantIdsQuery());
		return Results.Ok(result);
	}

	[HttpPost]
	[Authorize(KeycloakPolicies.BookingManager)]
	[EndpointName("BookingCreateTenantId")]
	[ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CreateTenantIdResponse))]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	public async Task<IResult> CreateTenantId([FromBody] CreateTenantIdQuery query)
	{
		var result = await _mediator.Send(query);
		return Results.Ok(result);
	}

	[HttpDelete("{id}")]
	[Authorize(KeycloakPolicies.BookingManager)]
	[EndpointName("BookingDeleteTenantId")]
	[ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DeleteTenantIdResponse))]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	public async Task<IResult> DeleteTenantId([FromRoute] Guid id)
	{
		var result = await _mediator.Send(new DeleteTenantIdQuery { Id = id });
		return Results.Ok(result);
	}
}