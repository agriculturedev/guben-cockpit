using Domain.Projects.repository;
using Shared.Api;

namespace Api.Controllers.Projects.PublishProjects;

public class PublishProjectsHandler : ApiRequestHandler<PublishProjectsQuery, PublishProjectsResponse>
{
  private readonly IProjectRepository _projectRepository;

  public PublishProjectsHandler(IProjectRepository projectRepository)
  {
    _projectRepository = projectRepository;
  }

  public override async Task<PublishProjectsResponse> Handle(PublishProjectsQuery request,
    CancellationToken cancellationToken)
  {
    var projects = await _projectRepository.GetAllByIds(request.ProjectIds);

    foreach (var project in projects)
    {
      project.Publish();
    }

    return new PublishProjectsResponse();
  }
}
