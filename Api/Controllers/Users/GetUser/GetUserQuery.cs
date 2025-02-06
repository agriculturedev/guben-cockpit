using Api.Controllers.Users.Shared;
using Shared.Api;

namespace Api.Controllers.Users.GetUser;

public class GetUserQuery : IApiRequest<UserResponse>, IApiRequestWithCustomTransactions
{
  public required string KeycloakId { get; set; }
}
