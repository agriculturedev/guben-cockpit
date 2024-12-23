using Shared.Api;

namespace Api.Controllers.Users.GetUser;

public class GetUserQuery : IApiRequest<GetUserResponse>
{
    public required string KeycloakId { get; set; }
}