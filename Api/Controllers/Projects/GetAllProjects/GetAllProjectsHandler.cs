using Api.Controllers.Projects.Shared;
using Domain.Projects.repository;
using Shared.Api;

namespace Api.Controllers.Projects.GetAllProjects;

public class GetAllProjectsHandler : ApiRequestHandler<GetAllProjectsQuery, GetAllProjectsResponse>
{
  private readonly IProjectRepository _projectRepository;

  public GetAllProjectsHandler(IProjectRepository projectRepository)
  {
    _projectRepository = projectRepository;
  }

  public override async Task<GetAllProjectsResponse> Handle(GetAllProjectsQuery request, CancellationToken
      cancellationToken)
  {
    var projects = await _projectRepository.GetAll();

    return new GetAllProjectsResponse()
    {
      Projects = projects.Select(ProjectResponse.Map)
    };
  }
}
