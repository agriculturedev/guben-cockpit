using Shared.Api;

namespace Api.Controllers.FooterItems.UpsertFooterItem;

public class UpsertFooterItemQuery : IApiRequest<UpsertFooterItemResponse>
{
  public Guid? Id { get; set; }
  public required string Name { get; set; }
  public required string Content { get; set; }
}
