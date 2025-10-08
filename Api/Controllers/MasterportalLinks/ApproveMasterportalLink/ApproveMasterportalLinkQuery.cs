using Shared.Api;

namespace Api.Controllers.MasterportalLinks.ApproveMasterportalLink;

public class ApproveMasterportalLinkQuery : IApiRequest<ApproveMasterportalLinkResponse>
{
    public Guid Id { get; set; }
}
