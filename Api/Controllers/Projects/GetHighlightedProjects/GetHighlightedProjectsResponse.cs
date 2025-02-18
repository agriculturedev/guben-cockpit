using Api.Controllers.Projects.Shared;

namespace Api.Controllers.Projects.GetHighlightedProjects;

public struct GetHighlightedProjectsResponse
{
  public required IEnumerable<ProjectResponse> Projects { get; init; }
}
