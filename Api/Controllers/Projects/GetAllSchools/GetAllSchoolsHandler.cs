using Api.Controllers.Projects.Shared;
using Domain.Projects.repository;
using Shared.Api;

namespace Api.Controllers.Projects.GetAllSchools;

public class GetAllSchoolsHandler : ApiRequestHandler<GetAllSchoolsQuery, GetAllSchoolsResponse>
{
  private readonly IProjectRepository _projectRepository;

  public GetAllSchoolsHandler(IProjectRepository projectRepository)
  {
    _projectRepository = projectRepository;
  }

  public override async Task<GetAllSchoolsResponse> Handle(GetAllSchoolsQuery request,
  CancellationToken cancellationToken)
  {
    var result = _projectRepository.GetAllSchools();

    return new GetAllSchoolsResponse()
    {
      Projects = result.Select(ProjectResponse.Map)
    };
  }
}