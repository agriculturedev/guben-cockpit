using Api.Controllers.Projects.Shared;
using Shared.Api.Pagination;

namespace Api.Controllers.Projects.GetMyProjects;

public struct GetMyProjectsResponse
{
  public required IEnumerable<ProjectResponse> Results {get; init;}
}
