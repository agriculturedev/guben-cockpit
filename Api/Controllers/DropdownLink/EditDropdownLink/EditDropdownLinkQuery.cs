using Shared.Api;

namespace Api.Controllers.DropdownLink.EditDropdownLink;

public class EditDropdownLinkQuery : IAuthenticatedApiRequest, IApiRequest<EditDropdownLinkResponse>
{
    public required Guid Id { get; set; }
    public required string Title { get; set; }
    public required string Link { get; set; }
}
