using Api.Controllers.Users.Shared;
using Shared.Api;

namespace Api.Controllers.Users.GetMe;

public class GetMeQuery : IApiRequestWithCustomTransactions, IAuthenticatedApiRequest, IApiRequest<UserResponse>
{
}
