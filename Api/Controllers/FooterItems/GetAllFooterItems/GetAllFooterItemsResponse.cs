using Domain.FooterItems;

namespace Api.Controllers.FooterItems.GetAllFooterItems;

public struct GetAllFooterItemsResponse
{
  public required IEnumerable<FooterItemResponse> FooterItems { get; set; }
}

public struct FooterItemResponse
{
  public required Guid Id { get; set; }
  public required string Name { get; set; }
  public required string Content { get; set; }

  public static FooterItemResponse Map(FooterItem footerItem)
  {
    return new FooterItemResponse()
    {
      Id = footerItem.Id,
      Name = footerItem.Name,
      Content = footerItem.Content
    };
  }
}
