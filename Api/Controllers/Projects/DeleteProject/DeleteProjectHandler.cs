using Api.Infrastructure.Extensions;
using Api.Infrastructure.Keycloak;
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

    var projectToDelete = await _projectRepository.GetIncludingUnpublished(request.Id);
    if(projectToDelete is null)
      throw new ProblemDetailsException(TranslationKeys.ProjectNotFound);

    var isDeleter = _httpContextAccessor.HttpContext?.User.IsInRole(KeycloakPolicies.DeleteProjects) ?? false;

    if (projectToDelete.CreatedBy != user.Id && !isDeleter)
      throw new UnauthorizedAccessException(TranslationKeys.ProjectNotOwnedByUser);

    //Okay following Problem here
    //If the Project gets imported every 24h and we deleted it will just be created anew
    //therefore, if it was created by the Backend (CreatedBy 00000000-0000-0000-0000-000000000000) we just flag it as deleted
    if (projectToDelete.CreatedBy == Guid.Empty)
    {
      projectToDelete.Delete();
      _projectRepository.Save(projectToDelete);
    }
    else
    {
      _projectRepository.Delete(projectToDelete);      
    }

    return new DeleteProjectResponse();
  }
}
