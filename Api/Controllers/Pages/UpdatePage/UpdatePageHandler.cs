using System.Globalization;
using Api.Infrastructure.Extensions;
using Domain.Pages;
using Domain.Pages.repository;
using Shared.Api;

namespace Api.Controllers.Pages.UpdatePage;

public class UpdatePageHandler : ApiRequestHandler<UpdatePageQuery, UpdatePageResponse>
{
  private readonly IPageRepository _pageRepository;
  private readonly CultureInfo _culture;

  public UpdatePageHandler(IPageRepository pageRepository)
  {
    _pageRepository = pageRepository;
    _culture = CultureInfo.CurrentCulture;

  }

  public override async Task<UpdatePageResponse> Handle(UpdatePageQuery request, CancellationToken cancellationToken)
  {
    var page = await _pageRepository.Get(request.Id);
    if (page is null)
    {
      var (pageResult, newPage) = Page.Create(request.Id);
      pageResult.ThrowIfFailure();

      var updateTranslation = newPage.UpdateTranslation(request.Title, request.Description, _culture);
      updateTranslation.ThrowIfFailure();

      await _pageRepository.SaveAsync(newPage);
    }
    else
    {
      page.UpdateTranslation(request.Title, request.Description, _culture);
    }

    return new UpdatePageResponse();
  }
}
