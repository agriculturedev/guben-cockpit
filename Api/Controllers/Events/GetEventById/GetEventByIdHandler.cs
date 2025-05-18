using System.Globalization;
using Api.Controllers.Events.Shared;
using Domain;
using Domain.Events.repository;
using Shared.Api;

namespace Api.Controllers.Events.GetEventById;

public class GetEventByIdHandler : ApiRequestHandler<GetEventByIdQuery, GetEventByIdResponse>
{
  private IEventRepository _repository;
  private CultureInfo _culture;

  public GetEventByIdHandler(IEventRepository repository)
  {
    _repository = repository;
    _culture = CultureInfo.CurrentCulture;
  }

  public override async Task<GetEventByIdResponse> Handle(GetEventByIdQuery request, CancellationToken cancellationToken)
  {
    var @event = await _repository.GetById(request.Id);

    if (@event is null)
      throw new ProblemDetailsException(TranslationKeys.EventNotFound);

    return new GetEventByIdResponse
    {
      Result = EventResponse.Map(@event, _culture)
    };
  }
}
