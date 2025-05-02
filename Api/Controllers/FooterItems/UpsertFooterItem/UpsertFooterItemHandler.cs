using Api.Infrastructure.Extensions;
using Domain;
using Domain.FooterItems;
using Domain.FooterItems.repository;
using Shared.Api;

namespace Api.Controllers.FooterItems.UpsertFooterItem;

public class UpsertFooterItemHandler : ApiRequestHandler<UpsertFooterItemQuery, UpsertFooterItemResponse>
{
  private readonly IFooterItemRepository _footerItemRepository;

  public UpsertFooterItemHandler(IFooterItemRepository footerItemRepository)
  {
    _footerItemRepository = footerItemRepository;
  }

  public override async Task<UpsertFooterItemResponse> Handle(UpsertFooterItemQuery request, CancellationToken cancellationToken)
  {
    if (request.Id.HasValue)
    {
      var item = await _footerItemRepository.Get(request.Id.Value);
      if (item is null)
        throw new ProblemDetailsException(TranslationKeys.FooterItemNotFound);

      item.UpdateName(request.Name);
      item.UpdateContent(request.Content);
    }
    else
    {
      var (itemResult, item) = FooterItem.Create(request.Name, request.Content);
      itemResult.ThrowIfFailure();

      await _footerItemRepository.SaveAsync(item);
    }

    return new UpsertFooterItemResponse();
  }
}
