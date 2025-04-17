using Domain.FooterItems.repository;
using Shared.Api;

namespace Api.Controllers.FooterItems.GetAllFooterItems;

public class GetAllFooterItemsHandler : ApiRequestHandler<GetAllFooterItemsQuery, GetAllFooterItemsResponse>
{
  private readonly IFooterItemRepository _footerItemRepository;

  public GetAllFooterItemsHandler(IFooterItemRepository footerItemRepository)
  {
    _footerItemRepository = footerItemRepository;
  }

  public override async Task<GetAllFooterItemsResponse> Handle(GetAllFooterItemsQuery request, CancellationToken cancellationToken)
  {
    var footerItems = await _footerItemRepository.GetAllNonTracking();

    return new GetAllFooterItemsResponse()
    {
      FooterItems = footerItems.Select(FooterItemResponse.Map)
    };
  }
}
