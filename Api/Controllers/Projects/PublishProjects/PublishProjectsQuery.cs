using Shared.Api;

namespace Api.Controllers.Projects.PublishProjects;

public class PublishProjectsQuery : IApiRequest<PublishProjectsResponse>
{
  public required List<string> ProjectIds { get; set; }
}
