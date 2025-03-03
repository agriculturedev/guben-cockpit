using System.Globalization;
using Api.Controllers.Pages.Shared;
using Domain.Pages.repository;
using Shared.Api;

namespace Api.Controllers.Pages.GetAllPages;

public class GetAllPagesHandler : ApiRequestHandler<GetAllPagesQuery, GetAllPagesResponse>
{
  private readonly IPageRepository _pageRepository;
  private readonly CultureInfo _culture;

  public GetAllPagesHandler(IPageRepository pageRepository)
  {
    _pageRepository = pageRepository;
    _culture = CultureInfo.CurrentCulture;
  }

  public override async Task<GetAllPagesResponse> Handle(GetAllPagesQuery request, CancellationToken
      cancellationToken)
  {
    var pages = await _pageRepository.GetAll();

    return new GetAllPagesResponse
    {
      Pages = pages.Select(p => PageResponse.Map(p, _culture)).ToList()
    };
  }
}
