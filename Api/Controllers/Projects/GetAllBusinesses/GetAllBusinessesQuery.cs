using Shared.Api;
using Shared.Api.Pagination;

namespace Api.Controllers.Projects.GetAllBusinesses;

public class GetallBusinessesQuery : PagedQuery , IApiRequest<GetAllBusinessesResponse>, IApiRequestWithCustomTransactions
{
}
