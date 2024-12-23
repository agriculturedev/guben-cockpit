using Shared.Api;

namespace Api.Controllers.Users.CreateUser;

public class CreateUserQuery : IApiRequest<CreateUserResponse>
{
    public required string KeycloakId { get; set; } = null!;
    
}