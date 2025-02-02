using Api.Controllers.Projects.Shared;

namespace Api.Controllers.Projects.GetMyProjects;

public struct GetMyProjectsResponse
{
  public required IEnumerable<ProjectResponse> Projects { get; set; }
}
