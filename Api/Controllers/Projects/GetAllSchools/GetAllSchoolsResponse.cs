using Api.Controllers.Projects.Shared;

namespace Api.Controllers.Projects.GetAllSchools;

public struct GetAllSchoolsResponse
{
  public required IEnumerable<ProjectResponse> Projects { get; init; }
}