using System.Globalization;
using Api.Infrastructure.Extensions;
using Domain;
using Domain.Category.repository;
using Domain.Coordinates;
using Domain.Events;
using Domain.Events.repository;
using Domain.Locations.repository;
using Domain.Urls;
using Shared.Api;
using Shared.Domain.Validation;

namespace Api.Controllers.Events.CreateEvent;

public class CreateEventHandler : ApiRequestHandler<CreateEventQuery, CreateEventResponse>
{
  private readonly IEventRepository _eventRepository;
  private readonly ILocationRepository _locationRepository;
  private readonly ICategoryRepository _categoryRepository;
  private readonly CultureInfo _culture;

  public CreateEventHandler(IEventRepository eventRepository, ILocationRepository locationRepository,
    ICategoryRepository categoryRepository)
  {
    _eventRepository = eventRepository;
    _locationRepository = locationRepository;
    _categoryRepository = categoryRepository;
    _culture = CultureInfo.CurrentCulture;
  }

  public override async Task<CreateEventResponse> Handle(CreateEventQuery request, CancellationToken cancellationToken)
  {
    var (coordsResult, coords) = Coordinates.Create(request.Latitude, request.Longitude);
    coordsResult.ThrowIfFailure();

    var (urlResult, urls) = request.Urls.Select(url => Url.Create(url.Link, url.Description)).MergeResults();
    urlResult.ThrowIfFailure();

    var location = await _locationRepository.Get(request.LocationId);
    if (location is null)
      throw new ProblemDetailsException(TranslationKeys.LocationNotFound);
    var categories = _categoryRepository.GetByIds(request.CategoryIds).ToList();

    var (eventResult, @event) = Event.Create(request.EventId, request.TerminId, request.Title, request.Description,
      request.StartDate, request.EndDate, location, coords, urls, categories, _culture);
    eventResult.ThrowIfFailure();

    await _eventRepository.SaveAsync(@event);

    return new CreateEventResponse();
  }
}
