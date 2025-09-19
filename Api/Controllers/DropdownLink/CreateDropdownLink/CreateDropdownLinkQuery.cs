using Shared.Api;

namespace Api.Controllers.DropdownLink.CreateDropdownLink;

public class CreateDropdownLinkQuery : IAuthenticatedApiRequest, IApiRequest<CreateDropdownLinkResponse>
{
    public required Guid DropdownId { get; set; }
    public required string Title { get; set; }
    public required string Link { get; set; }
}
