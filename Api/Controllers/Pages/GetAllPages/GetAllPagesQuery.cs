using Shared.Api;
using Shared.Api.Pagination;

namespace Api.Controllers.Pages.GetAllPages;

public class GetAllPagesQuery : PagedQuery, IApiRequest<GetAllPagesResponse>, IApiRequestWithCustomTransactions
{
}
