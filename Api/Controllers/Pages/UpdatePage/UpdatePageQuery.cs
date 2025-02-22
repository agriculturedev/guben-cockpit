using Shared.Api;

namespace Api.Controllers.Pages.UpdatePage;

// not sure if this will work with the abstract class
public class UpdatePageQuery : IApiRequest<UpdatePageResponse>, IAuthenticatedApiRequest
{
  public required string Id { get; set; }
  public required string Title { get; set; }
  public required string Description { get; set; }
}
