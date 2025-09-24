using Shared.Api;

namespace Api.Controllers.DropdownLink.DeleteDropdownLink;

public class DeleteDropdownLinkQuery : IAuthenticatedApiRequest, IApiRequest<DeleteDropdownLinkResponse>
{
  public required Guid Id { get; set; }
}