using Api.Controllers.Pages.Shared;
using Shared.Api;
using Shared.Api.Pagination;

namespace Api.Controllers.Pages.GetPage;

public class GetPageQuery : IApiRequest<PageResponse>, IApiRequestWithCustomTransactions
{
  public required string Id { get; set; }

}
