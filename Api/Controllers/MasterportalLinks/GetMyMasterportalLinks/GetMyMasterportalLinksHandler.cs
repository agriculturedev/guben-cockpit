using Api.Controllers.MasterportalLinks.Shared;
using Api.Infrastructure.Extensions;
using Domain;
using Domain.MasterportalLinks.repository;
using Domain.Users.repository;
using Shared.Api;

namespace Api.Controllers.MasterportalLinks.GetMyMasterportalLinks;

public class GetMyMasterportalLinksHandler : ApiRequestHandler<GetMyMasterportalLinksQuery, GetMyMasterportalLinksResponse>
{

    private readonly IMasterportalLinkRepository _masterportalLinkRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IUserRepository _userRepository;

    public GetMyMasterportalLinksHandler(
        IMasterportalLinkRepository masterportalLinkRepository,
        IHttpContextAccessor httpContextAccessor,
        IUserRepository userRepository
    )
    {
        _masterportalLinkRepository = masterportalLinkRepository;
        _httpContextAccessor = httpContextAccessor;
        _userRepository = userRepository;
    }

    public override async Task<GetMyMasterportalLinksResponse> Handle(GetMyMasterportalLinksQuery request, CancellationToken cancellationToken)
    {
        var keycloakId = _httpContextAccessor.HttpContext?.User.GetKeycloakId();
        if (string.IsNullOrEmpty(keycloakId))
            throw new UnauthorizedAccessException(TranslationKeys.UserNotLoggedIn);

        var user = await _userRepository.GetByKeycloakId(keycloakId);
        if (user is null)
            throw new UnauthorizedAccessException(TranslationKeys.UserNotFound);

        var masterportalLinks = await _masterportalLinkRepository.GetAllCreatedBy(user.KeycloakId, cancellationToken);
        if (masterportalLinks is null)
            return new GetMyMasterportalLinksResponse();

        var ordered = masterportalLinks
            .OrderByDescending(e => e.CreatedAtUtc);

        return new GetMyMasterportalLinksResponse()
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