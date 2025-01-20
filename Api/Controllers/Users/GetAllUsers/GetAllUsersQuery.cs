using Shared.Api;
using Shared.Api.Pagination;

namespace Api.Controllers.Users.GetAllUsers;

public class GetAllUsersQuery : PagedQuery, IApiRequestWithCustomTransactions, IAuthenticatedApiRequest, IApiRequest<GetAllUsersResponse>
{
}
