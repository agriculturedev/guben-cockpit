using Shared.Api;

namespace Api.Controllers.Projects.CreateProject;

public class CreateProjectQuery : IAuthenticatedApiRequest, IApiRequest<CreateProjectResponse>
{
  public required string Title { get; set; }
  public string? Description { get; set; }
  public string? FullText { get; set; }
  public string? ImageCaption { get; set; }
  public string? ImageUrl { get; set; }
  public string? ImageCredits { get; set; }
  public bool? Highlighted { get; set; } = false;
}
