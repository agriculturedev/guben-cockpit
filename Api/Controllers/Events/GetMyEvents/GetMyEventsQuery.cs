using Api.Controllers.Events.Shared;
using Api.Shared;
using Microsoft.AspNetCore.Mvc;
using Shared.Api;
using Shared.Api.Pagination;

namespace Api.Controllers.Events.GetMyEvents;

public class GetMyEventsQuery : IApiRequest<GetMyEventsResponse>, IApiRequestWithCustomTransactions { }
