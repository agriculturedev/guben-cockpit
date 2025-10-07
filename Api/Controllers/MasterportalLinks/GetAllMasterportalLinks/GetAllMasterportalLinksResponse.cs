using Api.Controllers.MasterportalLinks.Shared;

namespace Api.Controllers.MasterportalLinks.GetAllMasterportalLinks;

public struct GetAllMasterportalLinksResponse
{
    public List<MasterportalLinkResponse> Links { get; set; }
}