using Api.Infrastructure.Extensions;
using Domain;
using Domain.MasterportalLinks.repository;
using Domain.Users.repository;
using Shared.Api;

namespace Api.Controllers.MasterportalLinks.RejectMasterportalLink;

public class RejectMasterportalLinkHandler : ApiRequestHandler<RejectMasterportalLinkQuery, RejectMasterportalLinkResponse>
{
    private readonly IMasterportalLinkRepository _masterportalLinkRepository;
    private readonly IUserRepository _userRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public RejectMasterportalLinkHandler(
        IMasterportalLinkRepository masterportalLinkRepository,
        IUserRepository userRepository,
        IHttpContextAccessor httpContextAccessor)
    {
        _masterportalLinkRepository = masterportalLinkRepository;
        _userRepository = userRepository;
        _httpContextAccessor = httpContextAccessor;
    }

    public override async Task<RejectMasterportalLinkResponse> Handle(
        RejectMasterportalLinkQuery request,
        CancellationToken cancellationToken)
    {
        var keycloakId = _httpContextAccessor.HttpContext?.User.GetKeycloakId();
        if (string.IsNullOrWhiteSpace(keycloakId))
            throw new UnauthorizedAccessException(TranslationKeys.UserNotLoggedIn);

        var user = await _userRepository.GetByKeycloakId(keycloakId);
        if (user is null)
            throw new UnauthorizedAccessException(TranslationKeys.UserNotFound);

        var masterportalLink = await _masterportalLinkRepository.Get(request.Id);
        if (masterportalLink == null)
            throw new ProblemDetailsException(TranslationKeys.MasterportalLinkNotFound);

        masterportalLink.Reject(user.KeycloakId);

        await _masterportalLinkRepository.SaveAsync(masterportalLink);

        return new RejectMasterportalLinkResponse();
    }
}
