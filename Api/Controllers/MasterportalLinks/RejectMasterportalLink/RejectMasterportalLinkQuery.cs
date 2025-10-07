using Shared.Api;

namespace Api.Controllers.MasterportalLinks.RejectMasterportalLink;

public class RejectMasterportalLinkQuery : IApiRequest<RejectMasterportalLinkResponse>
{
    public Guid Id { get; set; }
}
