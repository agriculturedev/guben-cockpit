using Shared.Api;

namespace Api.Controllers.Projects.UnpublishProjects;

public class UnpublishProjectsQuery : IApiRequest<UnpublishProjectsResponse>
{
  public required List<string> ProjectIds { get; set; }
}
