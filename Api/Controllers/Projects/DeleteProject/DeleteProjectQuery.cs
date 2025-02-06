using Shared.Api;

namespace Api.Controllers.Projects.DeleteProject;

public class DeleteProjectQuery : IApiRequest<DeleteProjectResponse>
{
  public required string Id { get; set; }
}
