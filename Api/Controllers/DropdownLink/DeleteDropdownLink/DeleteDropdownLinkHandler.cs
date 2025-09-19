using Domain;
using Domain.DropdownLink.repository;
using Shared.Api;

namespace Api.Controllers.DropdownLink.DeleteDropdownLink;

public class DeleteDropdownLinkHandler : ApiRequestHandler<DeleteDropdownLinkQuery, DeleteDropdownLinkResponse>
{
  private readonly IDropdownLinkRepository _dropdownLinkRepository;

  public DeleteDropdownLinkHandler(IDropdownLinkRepository dropdownLinkRepository)
  {
    _dropdownLinkRepository = dropdownLinkRepository;
  }

  public override async Task<DeleteDropdownLinkResponse> Handle(DeleteDropdownLinkQuery request, CancellationToken cancellationToken)
  {
    var dropdownLinkToDelete = await _dropdownLinkRepository.Get(request.Id);
    if (dropdownLinkToDelete is null)
      throw new ProblemDetailsException(TranslationKeys.DropdownLinkNotFound);

    _dropdownLinkRepository.Delete(dropdownLinkToDelete);

    return new DeleteDropdownLinkResponse();
  }
}
