using Api.Controllers.Projects.Shared;

namespace Api.Controllers.Projects.GetAllProjects;

public class GetAllProjectsResponse
{
  public required IEnumerable<ProjectResponse> Projects { get; set; }
}
