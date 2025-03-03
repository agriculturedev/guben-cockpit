using Api.Infrastructure.Extensions;
using Api.Infrastructure.Translations;
using Domain;
using Domain.Category.repository;
using Domain.Coordinates;
using Domain.Events;
using Domain.Events.repository;
using Domain.Locations.repository;
using Domain.Urls;
using Shared.Api;
using Shared.Domain.Validation;

namespace Api.Controllers.Events.UpdateEvent;

public class UpdateEventHandler : ApiRequestHandler<UpdateEventQuery, UpdateEventResponse>
{
  private readonly IEventRepository _eventRepository;
  private readonly ILocationRepository _locationRepository;
  private readonly ICategoryRepository _categoryRepository;
  private readonly ICultureProvider _cultureProvider;

  public UpdateEventHandler(IEventRepository eventRepository, ICategoryRepository categoryRepository,
    ILocationRepository locationRepository, ICultureProvider cultureProvider)
  {
    _eventRepository = eventRepository;
    _categoryRepository = categoryRepository;
    _locationRepository = locationRepository;
    _cultureProvider = cultureProvider;
  }

  public override async Task<UpdateEventResponse> Handle(UpdateEventQuery request, CancellationToken cancellationToken)
  {
    var eventToUpdate = await _eventRepository.GetIncludingUnpublished(request.Id);
    if (eventToUpdate is null)
      throw new ProblemDetailsException(TranslationKeys.EventNotFound);

    var (coordsResult, coords) = Coordinates.Create(request.Latitude, request.Longitude);
    coordsResult.ThrowIfFailure();

    var (urlResult, urls) = request.Urls.Select(url => Url.Create(url.Link, url.Description)).MergeResults();
    urlResult.ThrowIfFailure();

    var location = await _locationRepository.Get(request.LocationId);
    if (location is null)
      throw new ProblemDetailsException(TranslationKeys.LocationNotFound);

    var categories = _categoryRepository.GetByIds(request.CategoryIds).ToList();
    if (categories is null)
      throw new ProblemDetailsException(TranslationKeys.CategoryNotFound);

    var (i18NResult, i18NData) = EventI18NData.Create(request.Title, request.Description);
    i18NResult.ThrowIfFailure();

    var updateResult = eventToUpdate.Update(i18NData, request.StartDate, request.EndDate, coords, location, categories,
      urls, _cultureProvider.GetCulture());

    updateResult.ThrowIfFailure();

    return new UpdateEventResponse();
  }
}
