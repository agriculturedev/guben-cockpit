using System.Globalization;
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
  private readonly CultureInfo _culture;

  public CreateProjectHandler(IProjectRepository projectRepository, IUserRepository userRepository,
    IHttpContextAccessor httpContextAccessor)
  {
    _projectRepository = projectRepository;
    _userRepository = userRepository;
    _httpContextAccessor = httpContextAccessor;
    _culture = CultureInfo.CurrentCulture;
  }

  public override async Task<CreateProjectResponse> Handle(CreateProjectQuery request, CancellationToken cancellationToken)
  {
    var keycloakId = _httpContextAccessor.HttpContext?.User.GetKeycloakId();
    if (keycloakId == null)
      throw new UnauthorizedAccessException(TranslationKeys.UserNotLoggedIn);

    var user = await _userRepository.GetByKeycloakId(keycloakId);
    if (user is null)
      throw new ProblemDetailsException(TranslationKeys.UserNotFound);

    if (!ProjectType.TryFromValue(request.Type, out var type))
      throw new ProblemDetailsException(TranslationKeys.ProjectTypeInvalid);

    var (projectResult, project) = Project.CreateWithGeneratedId(
      type,
      request.Title,
      request.Description,
      request.FullText,
      request.ImageCaption,
      request.ImageUrl,
      request.ImageCredits,
      user.Id,
      _culture
    );

    projectResult.ThrowIfFailure();

    await _projectRepository.SaveAsync(project);

    return new CreateProjectResponse
    {
      Id = project.Id,
      Type = project.Type,
    };
  }
}
