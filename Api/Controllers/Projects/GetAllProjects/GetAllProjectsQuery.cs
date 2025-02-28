using Shared.Api;
using Shared.Api.Pagination;

namespace Api.Controllers.Projects.GetAllProjects;

public class GetAllProjectsQuery : PagedQuery , IApiRequest<GetAllProjectsResponse>, IApiRequestWithCustomTransactions
{
}
