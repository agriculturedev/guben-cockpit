using System.Globalization;
using Api.Infrastructure.Extensions;
using Api.Infrastructure.Keycloak;
using Domain;
using Domain.Projects;
using Domain.Projects.repository;
using Domain.Users.repository;
using Shared.Api;

namespace Api.Controllers.Projects.UpdateProject;

public class UpdateProjectHandler : ApiRequestHandler<UpdateProjectQuery, UpdateProjectResponse>
{
  private readonly IProjectRepository _projectRepository;
  private readonly IUserRepository _userRepository;
  private readonly IHttpContextAccessor _httpContextAccessor;
  private readonly CultureInfo _culture;

  public UpdateProjectHandler(IProjectRepository projectRepository, IHttpContextAccessor httpContextAccessor, IUserRepository userRepository)
  {
    _projectRepository = projectRepository;
    _httpContextAccessor = httpContextAccessor;
    _userRepository = userRepository;
    _culture = CultureInfo.CurrentCulture;
  }

  public override async Task<UpdateProjectResponse> Handle(UpdateProjectQuery request, CancellationToken cancellationToken)
  {
    if(request.Id == null) {
      throw new ProblemDetailsException(TranslationKeys.MissingProjectId);
    }

    var keycloakId = _httpContextAccessor.HttpContext?.User.GetKeycloakId();
    if (string.IsNullOrEmpty(keycloakId))
      throw new UnauthorizedAccessException(TranslationKeys.UserNotLoggedIn);

    var user = await _userRepository.GetByKeycloakId(keycloakId);
    if (user is null)
      throw new UnauthorizedAccessException(TranslationKeys.UserNotFound);

    var project = await _projectRepository.GetIncludingUnpublished(request.Id);
    if (project is null)
      throw new ProblemDetailsException(TranslationKeys.ProjectNotFound);

    var isEditor = _httpContextAccessor.HttpContext?.User.IsInRole(KeycloakPolicies.EditProjects) ?? false;

    if (project.CreatedBy != user.Id && !isEditor)
      throw new UnauthorizedAccessException(TranslationKeys.ProjectNotOwnedByUser);

    if (!ProjectType.TryFromValue(request.Type, out var type))
      throw new ProblemDetailsException(TranslationKeys.ProjectTypeInvalid);

    var (i18NResult, i18NData) = ProjectI18NData.Create(request.FullText, request.Description);
    i18NResult.ThrowIfFailure();

    project.Update(
      type,
      request.Title,
      request.ImageCaption,
      request.ImageUrl,
      request.ImageCredits,
      _culture,
      i18NData
    );

    return new UpdateProjectResponse();
  }
}
