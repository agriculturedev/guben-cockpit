using Api.Controllers.Projects.Shared;

namespace Api.Controllers.Projects.GetAllProjects;

public struct GetAllProjectsResponse
{
  public required IEnumerable<ProjectResponse> Projects { get; set; }
}
