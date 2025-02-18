using Api.Infrastructure.Extensions;
using Domain.Pages;
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
    {
      var (pageResult, newPage) = Page.Create(request.Id);
      pageResult.ThrowIfFailure();

      var updateTranslation = newPage.UpdateTranslation(request.LanguageKey, request.Title, request.Description);
      updateTranslation.ThrowIfFailure();

      await _pageRepository.SaveAsync(newPage);
    }
    else
    {
      page.UpdateTranslation(request.LanguageKey, request.Title, request.Description);
    }

    return new UpdatePageResponse();
  }
}
