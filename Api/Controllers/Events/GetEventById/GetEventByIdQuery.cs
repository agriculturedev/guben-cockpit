using Shared.Api;

namespace Api.Controllers.Events.GetEventById;

public record GetEventByIdQuery(Guid Id) : IApiRequest<GetEventByIdResponse>;
