using Domain.Pages;

namespace Api.Controllers.Pages.Shared;

public class PageResponse
{
  public required string Name { get; set; }
  public required string Title { get; set; }
  public required string Description { get; set; }

  public static PageResponse Map(Page page)
  {
    return new PageResponse
    {
      Name = page.Id,
      Title = page.Title,
      Description = page.Description
    };
  }

}
