using Shared.Api;

namespace Api.Controllers.MasterportalLinks.CreateMasterportalLink;

public class CreateMasterportalLinkQuery : IAuthenticatedApiRequest, IApiRequest<CreateMasterportalLinkResponse>
{
    public required string Url { get; set; }
    public required string Name { get; set; }
    public required string Folder { get; set; }
}