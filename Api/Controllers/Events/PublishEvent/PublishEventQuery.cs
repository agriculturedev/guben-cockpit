using Shared.Api;

namespace Api.Controllers.Events.PublishEvent;

public class PublishEventQuery : IApiRequest<PublishEventResponse>
{
  public bool Publish { get; set; }

  public List<Guid> Ids { get; set; }
}
