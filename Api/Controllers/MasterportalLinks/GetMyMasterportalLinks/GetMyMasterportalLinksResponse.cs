using Api.Controllers.MasterportalLinks.Shared;

namespace Api.Controllers.MasterportalLinks.GetMyMasterportalLinks;

public struct GetMyMasterportalLinksResponse
{
    public List<MasterportalLinkResponse> Links { get; set; }
}