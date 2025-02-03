using Api.Controllers.Projects.Shared;
using Api.Infrastructure.Extensions;
using Domain;
using Domain.Projects.repository;
using Domain.Users.repository;
using Shared.Api;

namespace Api.Controllers.Projects.GetMyProjects;

public class GetMyProjectsHandler : ApiRequestHandler<GetMyProjectsQuery, GetMyProjectsResponse>
{
  private readonly IProjectRepository _projectRepository;
  private readonly IHttpContextAccessor _httpContextAccessor;
  private readonly IUserRepository _userRepository;

  public GetMyProjectsHandler(IProjectRepository projectRepository, IHttpContextAccessor httpContextAccessor, IUserRepository userRepository)
  {
    _projectRepository = projectRepository;
    _httpContextAccessor = httpContextAccessor;
    _userRepository = userRepository;
  }

  public override async Task<GetMyProjectsResponse> Handle(GetMyProjectsQuery request, CancellationToken
      cancellationToken)
  {
    var keycloakId = _httpContextAccessor.HttpContext?.User.GetKeycloakId();
    if (string.IsNullOrEmpty(keycloakId))
      throw new UnauthorizedAccessException(TranslationKeys.UserNotLoggedIn);

    var user = await _userRepository.GetByKeycloakId(keycloakId);
    if (user is null)
      throw new UnauthorizedAccessException(TranslationKeys.UserNotFound);

    var projects = _projectRepository.GetAllOwnedBy(user.Id);

    return new GetMyProjectsResponse()
    {
      Projects = projects.Select(ProjectResponse.Map)
    };
  }
}
