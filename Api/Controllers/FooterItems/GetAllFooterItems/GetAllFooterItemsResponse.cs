using Domain.FooterItems;

namespace Api.Controllers.FooterItems.GetAllFooterItems;

public struct GetAllFooterItemsResponse
{
  public IEnumerable<FooterItemResponse> FooterItems { get; set; }
}

public struct FooterItemResponse
{
  public string Name { get; set; }
  public string Content { get; set; }

  public static FooterItemResponse Map(FooterItem footerItem)
  {
    return new FooterItemResponse()
    {
      Name = footerItem.Name,
      Content = footerItem.Content
    };
  }
}
