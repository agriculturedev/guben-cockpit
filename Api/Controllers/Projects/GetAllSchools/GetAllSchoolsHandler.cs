using System.Globalization;
using Api.Controllers.Projects.Shared;
using Domain.Projects.repository;
using Shared.Api;

namespace Api.Controllers.Projects.GetAllSchools;

public class GetAllSchoolsHandler : ApiRequestHandler<GetAllSchoolsQuery, GetAllSchoolsResponse>
{
  private readonly IProjectRepository _projectRepository;
  private readonly CultureInfo _culture;

  public GetAllSchoolsHandler(IProjectRepository projectRepository)
  {
    _projectRepository = projectRepository;
    _culture = CultureInfo.CurrentCulture;
  }

  public override async Task<GetAllSchoolsResponse> Handle(GetAllSchoolsQuery request,
  CancellationToken cancellationToken)
  {
    var result = await _projectRepository.GetAllSchools();

    return new GetAllSchoolsResponse()
    {
      Projects = result.Select(p => ProjectResponse.Map(p, _culture))
    };
  }
}