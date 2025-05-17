using System.Text.Json.Serialization;
using Ardalis.SmartEnum.SystemTextJson;
using Domain.Projects;
using Shared.Api;

namespace Api.Controllers.Projects.UpdateProject;

public class UpdateProjectQuery : IAuthenticatedApiRequest, IApiRequest<UpdateProjectResponse>
{
  public string? Id { get; private set; }

  [JsonConverter(typeof(SmartEnumNameConverter<ProjectType, int>))]
  public required ProjectType Type { get; set; }
  public required string Title { get; set; }
  public string? Description { get; set; }
  public string? FullText { get; set; }
  public string? ImageCaption { get; set; }
  public string? ImageUrl { get; set; }
  public string? ImageCredits { get; set; }

  public void SetId(string id) => Id = id;
}
