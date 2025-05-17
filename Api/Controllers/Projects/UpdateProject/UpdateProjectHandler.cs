using Api.Infrastructure.Extensions;
using Domain;
using Domain.Projects.repository;
using Domain.Users.repository;
using Shared.Api;

namespace Api.Controllers.Projects.UpdateProject;

public class UpdateProjectHandler : ApiRequestHandler<UpdateProjectQuery, UpdateProjectResponse>
{
  private readonly IProjectRepository _projectRepository;
  private readonly IUserRepository _userRepository;
  private readonly IHttpContextAccessor _httpContextAccessor;

  public UpdateProjectHandler(IProjectRepository projectRepository, IHttpContextAccessor httpContextAccessor, IUserRepository userRepository)
  {
    _projectRepository = projectRepository;
    _httpContextAccessor = httpContextAccessor;
    _userRepository = userRepository;
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

    if (project.CreatedBy != user.Id)
      throw new UnauthorizedAccessException(TranslationKeys.ProjectNotOwnedByUser);

    project.Update(
      request.Type,
      request.Title,
      request.Description,
      request.FullText,
      request.ImageCaption,
      request.ImageUrl,
      request.ImageCredits
    );

    return new UpdateProjectResponse();
  }
}
