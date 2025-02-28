using Api.Controllers.Projects.Shared;
using Domain.Projects.repository;
using Shared.Api;

namespace Api.Controllers.Projects.GetHighlightedProjects;

public class GetHighlightedProjectsHandler : ApiRequestHandler<GetHighlightedProjectsQuery, GetHighlightedProjectsResponse>
{
  private readonly IProjectRepository _projectRespository;

  public GetHighlightedProjectsHandler(IProjectRepository projectRepository)
  {
    _projectRespository = projectRepository;
  }

  public override async Task<GetHighlightedProjectsResponse> Handle(GetHighlightedProjectsQuery request,
    CancellationToken cancellationToken)
  {
    //TODO: make a highlighting system for the projects
    var result = await _projectRespository.GetAll();

    return new GetHighlightedProjectsResponse()
    {
      Projects = result.Select(ProjectResponse.Map) ?? []
    };
  }
}
