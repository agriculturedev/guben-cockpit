using Domain.Projects;

namespace Api.Controllers.Projects.CreateProject;

public struct CreateProjectResponse
{
  public string Id { get; set; }
  public ProjectType Type { get; set; }
}
