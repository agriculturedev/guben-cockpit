using Api.Controllers.Pages.Shared;

namespace Api.Controllers.Pages.GetAllPages;

public class GetAllPagesResponse
{
  public required List<PageResponse> Pages { get; set; }
}
