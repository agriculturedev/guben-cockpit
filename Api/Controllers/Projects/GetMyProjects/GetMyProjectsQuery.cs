using Shared.Api;
using Shared.Api.Pagination;

namespace Api.Controllers.Projects.GetMyProjects;

public class GetMyProjectsQuery : IApiRequest<GetMyProjectsResponse>, IApiRequestWithCustomTransactions
{
}
