using Shared.Api;

namespace Api.Controllers.Events.GetEventById;

public record GetEventByIdQuery(Guid id) : IApiRequest<GetEventByIdResponse>;
