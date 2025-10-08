using Api.Infrastructure.Extensions;
using Api.Services.Masterportal;
using Domain;
using Domain.MasterportalLinks.repository;
using Domain.Users.repository;
using Shared.Api;

namespace Api.Controllers.MasterportalLinks.ApproveMasterportalLink;

public class ApproveMasterportalLinkHandler : ApiRequestHandler<ApproveMasterportalLinkQuery, ApproveMasterportalLinkResponse>
{
    private readonly IMasterportalLinkRepository _masterportalLinkRepository;
    private readonly IUserRepository _userRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IMasterportalSnapshotPublisher _masterportalSnapshotPublisher;

    public ApproveMasterportalLinkHandler(
        IMasterportalLinkRepository masterportalLinkRepository,
        IUserRepository userRepository,
        IHttpContextAccessor httpContextAccessor,
        IMasterportalSnapshotPublisher masterportalSnapshotPublisher
    )
    {
        _masterportalLinkRepository = masterportalLinkRepository;
        _userRepository = userRepository;
        _httpContextAccessor = httpContextAccessor;
        _masterportalSnapshotPublisher = masterportalSnapshotPublisher;
    }

    public override async Task<ApproveMasterportalLinkResponse> Handle(
        ApproveMasterportalLinkQuery request,
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

        masterportalLink.Approve(user.KeycloakId);

        await _masterportalLinkRepository.SaveAsync(masterportalLink);

        // Regenerate masterportal snapshot ( config.json and services-internet.json )
        await _masterportalSnapshotPublisher.PublishAsync(cancellationToken);

        return new ApproveMasterportalLinkResponse();
    }
}
