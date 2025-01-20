using Domain.Projects.repository;
using Shared.Api;

namespace Api.Controllers.Projects.UnpublishProjects;

public class UnpublishProjectsHandler : ApiRequestHandler<UnpublishProjectsQuery, UnpublishProjectsResponse>
{
  private readonly IProjectRepository _projectRepository;

  public UnpublishProjectsHandler(IProjectRepository projectRepository)
  {
    _projectRepository = projectRepository;
  }

  public override async Task<UnpublishProjectsResponse> Handle(UnpublishProjectsQuery request,
    CancellationToken cancellationToken)
  {
    var projects = await _projectRepository.GetAllByIds(request.ProjectIds);

    foreach (var project in projects)
    {
      project.UnPublish();
    }

    return new UnpublishProjectsResponse();
  }
}
