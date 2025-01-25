using Shared.Api;

namespace Api.Controllers.Users.GetMe;

public class GetMeQuery : IApiRequestWithCustomTransactions, IAuthenticatedApiRequest, IApiRequest<GetMeResponse>
{
}
