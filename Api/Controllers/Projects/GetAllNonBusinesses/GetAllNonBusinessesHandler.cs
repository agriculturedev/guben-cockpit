using System.Globalization;
using Api.Controllers.Projects.Shared;
using Domain.Projects.repository;
using Shared.Api;

namespace Api.Controllers.Projects.GetAllNonBusinesses;

public class GetAllNonBusinessesHandler : ApiRequestHandler<GetAllNonBusinessesQuery, GetAllNonBusinessesResponse>
{
  private readonly IProjectRepository _projectRespository;
  private readonly CultureInfo _culture;

  public GetAllNonBusinessesHandler(IProjectRepository projectRepository)
  {
    _projectRespository = projectRepository;
    _culture = CultureInfo.CurrentCulture;
  }

  public override async Task<GetAllNonBusinessesResponse> Handle(GetAllNonBusinessesQuery request,
    CancellationToken cancellationToken)
  {
    var result = _projectRespository.GetAllNonBusinesses();

    return new GetAllNonBusinessesResponse()
    {
      Projects = result.Select(p => ProjectResponse.Map(p, _culture)) ?? []
    };
  }
}
