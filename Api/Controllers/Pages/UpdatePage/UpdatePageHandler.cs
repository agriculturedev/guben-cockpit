using Domain;
using Domain.Pages.repository;
using Shared.Api;

namespace Api.Controllers.Pages.UpdatePage;

public class UpdatePageHandler : ApiRequestHandler<UpdatePageQuery, UpdatePageResponse>
{
  private readonly IPageRepository _pageRepository;

  public UpdatePageHandler(IPageRepository pageRepository)
  {
    _pageRepository = pageRepository;
  }

  public override async Task<UpdatePageResponse> Handle(UpdatePageQuery request, CancellationToken cancellationToken)
  {
    var page = await _pageRepository.Get(request.Id);
    if (page is null)
      throw new ProblemDetailsException(TranslationKeys.PageNotFound);

    page.Update(request.Title, request.Description);

    return new UpdatePageResponse();
  }
}
