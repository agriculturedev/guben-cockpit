using Domain;
using Domain.FooterItems.repository;
using Shared.Api;

namespace Api.Controllers.FooterItems.DeleteFooterItem;

public class DeleteFooterItemHandler : ApiRequestHandler<DeleteFooterItemQuery, DeleteFooterItemResponse>
{
  private readonly IFooterItemRepository _footerItemRepository;

  public DeleteFooterItemHandler(IFooterItemRepository footerItemRepository)
  {
    _footerItemRepository = footerItemRepository;
  }

  public override async Task<DeleteFooterItemResponse> Handle(DeleteFooterItemQuery request, CancellationToken cancellationToken)
  {
    var footerItemToDelete = await _footerItemRepository.Get(request.Id);
    if (footerItemToDelete is null)
      throw new ProblemDetailsException(TranslationKeys.FooterItemNotFound);

    _footerItemRepository.Delete(footerItemToDelete);

    return new DeleteFooterItemResponse();
  }
}
