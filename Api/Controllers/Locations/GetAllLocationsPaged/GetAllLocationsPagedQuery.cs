using Shared.Api;
using Shared.Api.Pagination;

namespace Api.Controllers.Locations.GetAllLocationsPaged;

public class GetAllLocationsPagedQuery : PagedQuery, IApiRequestWithCustomTransactions, IApiRequest<GetAllLocationsPagedResponse>
{

}
