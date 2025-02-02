using Api.Infrastructure.Extensions;
using Domain;
using Domain.Projects.repository;
using Domain.Users.repository;
using Shared.Api;

namespace Api.Controllers.Projects.DeleteProject;

public class DeleteProjectHandler : ApiRequestHandler<DeleteProjectQuery, DeleteProjectResponse>
{
  private readonly IProjectRepository _projectRepository;
  private readonly IUserRepository _userRepository;
  private readonly IHttpContextAccessor _httpContextAccessor;

  public DeleteProjectHandler(IProjectRepository projectRepository, IUserRepository userRepository, IHttpContextAccessor httpContextAccessor)
  {
    _projectRepository = projectRepository;
    _userRepository = userRepository;
    _httpContextAccessor = httpContextAccessor;
  }

  public override async Task<DeleteProjectResponse> Handle(DeleteProjectQuery request, CancellationToken cancellationToken)
  {
    var keycloakId = _httpContextAccessor.HttpContext?.User.GetKeycloakId();
    if (keycloakId == null)
      throw new UnauthorizedAccessException(TranslationKeys.UserNotLoggedIn);

    var user = await _userRepository.GetByKeycloakId(keycloakId);
    if (user is null)
      throw new ProblemDetailsException(TranslationKeys.UserNotFound);

    var projectToDelete = await _projectRepository.Get(request.Id);
    if(projectToDelete is null)
      throw new ProblemDetailsException(TranslationKeys.ProjectNotFound);

    if (projectToDelete.CreatedBy != user.Id)
      throw new UnauthorizedAccessException(TranslationKeys.ProjectNotOwnedByUser);

    _projectRepository.Delete(projectToDelete);

    return new DeleteProjectResponse();
  }
}
