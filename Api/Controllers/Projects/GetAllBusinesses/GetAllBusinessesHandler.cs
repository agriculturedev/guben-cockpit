using System.Globalization;
using Api.Controllers.Projects.Shared;
using Domain.Projects.repository;
using Shared.Api;

namespace Api.Controllers.Projects.GetAllBusinesses;

public class GetAllBusinessesHandler : ApiPagedRequestHandler<GetallBusinessesQuery, GetAllBusinessesResponse, ProjectResponse>
{
  private readonly IProjectRepository _projectRepository;
  private readonly CultureInfo _culture;

  public GetAllBusinessesHandler(IProjectRepository projectRepository)
  {
    _projectRepository = projectRepository;
    _culture = CultureInfo.CurrentCulture;
  }

  public override async Task<GetAllBusinessesResponse> Handle(GetallBusinessesQuery request, CancellationToken
      cancellationToken)
  {
    var pagedResult = await _projectRepository.GetAllPagedBusinesses(request);

    return new GetAllBusinessesResponse
    {
      PageNumber = pagedResult.PageNumber,
      PageCount = pagedResult.PageCount,
      PageSize = pagedResult.PageSize,
      TotalCount = pagedResult.TotalCount,
      Results = pagedResult.Results.Select(p => ProjectResponse.Map(p, _culture))
    };
  }
}
