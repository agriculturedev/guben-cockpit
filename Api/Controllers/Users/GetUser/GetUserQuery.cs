using Shared.Api;

namespace Api.Controllers.Users.GetUser;

public class GetUserQuery : IApiRequest<GetUserResponse>, IApiRequestWithCustomTransactions
{
  public required string KeycloakId { get; set; }
}
