using Domain.Pages;

namespace Api.Controllers.Pages.Shared;

public struct PageResponse
{
  public required string Id { get; set; }
  public required string Title { get; set; }
  public required string Description { get; set; }

  public static PageResponse Map(Page page)
  {
    return new PageResponse
    {
      Id = page.Id,
      Title = page.Title,
      Description = page.Description
    };
  }

}
