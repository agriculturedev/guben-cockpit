using Shared.Api;
using Shared.Api.Pagination;

namespace Api.Controllers.Projects.GetAllProjects;

public class GetallBusinessesQuery : PagedQuery , IApiRequest<GetAllBusinessesResponse>, IApiRequestWithCustomTransactions
{
}
