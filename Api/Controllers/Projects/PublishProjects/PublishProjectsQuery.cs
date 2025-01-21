using Shared.Api;

namespace Api.Controllers.Projects.PublishProjects;

public class PublishProjectsQuery : IApiRequest<PublishProjectsResponse>
{
  public bool Publish { get; set; }
  public required List<string> ProjectIds { get; set; }
}
