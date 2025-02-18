using Domain;
using Domain.Events.repository;
using Shared.Api;

namespace Api.Controllers.Events.DeleteEvent;

public class DeleteEventHandler : ApiRequestHandler<DeleteEventQuery, DeleteEventResponse>
{
  private readonly IEventRepository _eventRepository;

  public DeleteEventHandler(IEventRepository eventRepository)
  {
    _eventRepository = eventRepository;
  }

  public override async Task<DeleteEventResponse> Handle(DeleteEventQuery request, CancellationToken cancellationToken)
  {
    var eventToDelete = await _eventRepository.Get(request.Id);
    if (eventToDelete is null)
      throw new ProblemDetailsException(TranslationKeys.EventNotFound);

    _eventRepository.Delete(eventToDelete);

    return new DeleteEventResponse();
  }
}
