using Shared.Api;

namespace Api.Controllers.Events.DeleteEvent;

public class DeleteEventQuery : IApiRequest<DeleteEventResponse>
{
  public required Guid Id { get; set; }
}
