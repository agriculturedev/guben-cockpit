using Shared.Api;

namespace Api.Controllers.Pages.UpdatePage;

public class UpdatePageQuery : IAuthenticatedApiRequest, IApiRequest<UpdatePageResponse>
{
  public required string Id { get; set; }
  public required string Title { get; set; }
  public required string Description { get; set; }
}
