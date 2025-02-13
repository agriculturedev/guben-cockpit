using Api.Controllers.Projects.Shared;
using Domain.Projects.repository;
using Shared.Api;

namespace Api.Controllers.Projects.GetAllProjects;

public class GetAllProjectsHandler : ApiPagedRequestHandler<GetAllProjectsQuery, GetAllProjectsResponse, ProjectResponse>
{
  private readonly IProjectRepository _projectRepository;

  public GetAllProjectsHandler(IProjectRepository projectRepository)
  {
    _projectRepository = projectRepository;
  }

  public override async Task<GetAllProjectsResponse> Handle(GetAllProjectsQuery request, CancellationToken
      cancellationToken)
  {
    var pagedResult = await _projectRepository.GetAllPaged(request);

    return new GetAllProjectsResponse
    {
      PageNumber = pagedResult.PageNumber,
      PageCount = pagedResult.PageCount,
      PageSize = pagedResult.PageSize,
      TotalCount = pagedResult.TotalCount,
      Results = pagedResult.Results.Select(ProjectResponse.Map)
    };
  }
}
