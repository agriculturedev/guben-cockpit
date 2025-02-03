using Api.Infrastructure.Extensions;
using Domain;
using Domain.Projects;
using Domain.Projects.repository;
using Domain.Users.repository;
using Shared.Api;

namespace Api.Controllers.Projects.CreateProject;

public class CreateProjectHandler : ApiRequestHandler<CreateProjectQuery, CreateProjectResponse>
{
  private readonly IProjectRepository _projectRepository;
  private readonly IUserRepository _userRepository;
  private readonly IHttpContextAccessor _httpContextAccessor;

  public CreateProjectHandler(IProjectRepository projectRepository, IUserRepository userRepository, IHttpContextAccessor httpContextAccessor)
  {
    _projectRepository = projectRepository;
    _userRepository = userRepository;
    _httpContextAccessor = httpContextAccessor;
  }

  public override async Task<CreateProjectResponse> Handle(CreateProjectQuery request, CancellationToken cancellationToken)
  {
    var keycloakId = _httpContextAccessor.HttpContext?.User.GetKeycloakId();
    if (keycloakId == null)
      throw new UnauthorizedAccessException(TranslationKeys.UserNotLoggedIn);

    var user = await _userRepository.GetByKeycloakId(keycloakId);
    if (user is null)
      throw new ProblemDetailsException(TranslationKeys.UserNotFound);

    var (projectResult, project) = Project.CreateWithGeneratedId(request.Title, request.Description,  request.FullText, request.ImageCaption, request.ImageUrl, request.ImageCredits, user.Id);
    projectResult.ThrowIfFailure();

    await _projectRepository.SaveAsync(project);

    return new CreateProjectResponse();
  }
}
