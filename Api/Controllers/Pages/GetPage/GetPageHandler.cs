using System.Globalization;
using Api.Controllers.Pages.Shared;
using Domain;
using Domain.Pages.repository;
using Shared.Api;

namespace Api.Controllers.Pages.GetPage;

public class GetPageHandler : ApiRequestHandler<GetPageQuery, PageResponse>
{
  private readonly IPageRepository _pageRepository;

  public GetPageHandler(IPageRepository pageRepository)
  {
    _pageRepository = pageRepository;
  }

  public override async Task<PageResponse> Handle(GetPageQuery request, CancellationToken
      cancellationToken)
  {
    var page = await _pageRepository.Get(request.Id);

    if (page is null)
      throw new ProblemDetailsException(TranslationKeys.PageNotFound);

    return PageResponse.Map(page, CultureInfo.CurrentCulture);
  }
}
