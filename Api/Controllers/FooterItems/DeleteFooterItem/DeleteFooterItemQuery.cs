using Shared.Api;

namespace Api.Controllers.FooterItems.DeleteFooterItem;

public class DeleteFooterItemQuery : IApiRequest<DeleteFooterItemResponse>
{
  public required Guid Id { get; set; }
}
