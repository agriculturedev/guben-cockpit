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
    var projects = await _projectRepository.GetAllByIdsIncludingUnpublished(request.ProjectIds);

    foreach (var project in projects)
    {
      project.SetPublishedState(request.Publish);
    }

    return new PublishProjectsResponse();
  }
}
