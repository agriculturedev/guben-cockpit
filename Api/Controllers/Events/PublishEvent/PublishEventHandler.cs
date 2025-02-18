using Domain;
using Domain.Events.repository;
using Shared.Api;

namespace Api.Controllers.Events.PublishEvent;

public class PublishEventHandler : ApiRequestHandler<PublishEventQuery, PublishEventResponse>
{
  private readonly IEventRepository _eventRepository;

  public PublishEventHandler(IEventRepository eventRepository)
  {
    _eventRepository = eventRepository;
  }

  public override Task<PublishEventResponse> Handle(PublishEventQuery request,
    CancellationToken cancellationToken)
  {
    var eventsToPublish = _eventRepository.GetAllByIdsIncludingUnpublished(request.Ids);
    if (eventsToPublish is null)
      throw new ProblemDetailsException(TranslationKeys.EventNotFound);

    foreach (var @event in eventsToPublish)
    {
      @event.SetPublishedState(request.Publish);
    }

    return Task.FromResult(new PublishEventResponse());
  }
}
