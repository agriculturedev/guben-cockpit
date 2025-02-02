using Api.Controllers.Projects.Shared;

namespace Api.Controllers.Projects.GetMyProjects;

public class GetMyProjectsResponse
{
  public required IEnumerable<ProjectResponse> Projects { get; set; }
}
