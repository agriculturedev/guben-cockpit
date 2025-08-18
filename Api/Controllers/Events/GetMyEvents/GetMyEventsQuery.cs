using Api.Controllers.Events.Shared;
using Api.Shared;
using Microsoft.AspNetCore.Mvc;
using Shared.Api;
using Shared.Api.Pagination;

namespace Api.Controllers.Events.GetMyEvents;

public class GetMyEventsQuery : PagedQuery, IApiRequest<GetMyEventsResponse>, IApiRequestWithCustomTransactions
{
	//otherwise pagenNumber and pageSize is not generated...
	[FromQuery(Name = "Dummy")]
	public bool? Dummy { get; set; }
}
