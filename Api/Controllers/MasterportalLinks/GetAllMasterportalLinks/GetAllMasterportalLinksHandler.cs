using Api.Controllers.MasterportalLinks.Shared;
using Domain.MasterportalLinks.repository;
using Shared.Api;

namespace Api.Controllers.MasterportalLinks.GetAllMasterportalLinks;

public class GetAllMasterportalLinksHandler : ApiRequestHandler<GetAllMasterportalLinksQuery, GetAllMasterportalLinksResponse>
{

    private readonly IMasterportalLinkRepository _masterportalLinkRepository;

    public GetAllMasterportalLinksHandler(IMasterportalLinkRepository masterportalLinkRepository)
    {
        _masterportalLinkRepository = masterportalLinkRepository;
    }

    public override async Task<GetAllMasterportalLinksResponse> Handle(GetAllMasterportalLinksQuery request, CancellationToken cancellationToken)
    {
        var masterportalLinks = await _masterportalLinkRepository.GetAll();
        if (masterportalLinks is null)
            return new GetAllMasterportalLinksResponse();

        var ordered = masterportalLinks
            .OrderByDescending(e => e.CreatedAtUtc);

        return new GetAllMasterportalLinksResponse()
        {
            Links = ordered.Select(e => new MasterportalLinkResponse
            {
                Id = e.Id,
                Folder = e.Folder,
                Name = e.Name,
                Status = e.Status,
                Url = e.Url,
            }).ToList()
        };
    }
}