using Api.Controllers.Projects.Shared;

namespace Api.Controllers.Projects.GetAllNonBusinesses;

public struct GetAllNonBusinessesResponse
{
  public required IEnumerable<ProjectResponse> Projects { get; init; }
}
