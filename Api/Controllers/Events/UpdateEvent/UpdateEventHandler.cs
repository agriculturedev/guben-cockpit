using Api.Infrastructure.Extensions;
using Domain;
using Domain.Category.repository;
using Domain.Coordinates;
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

  public UpdateEventHandler(IEventRepository eventRepository, ICategoryRepository categoryRepository,
    ILocationRepository locationRepository)
  {
    _eventRepository = eventRepository;
    _categoryRepository = categoryRepository;
    _locationRepository = locationRepository;
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

    var updateResult = eventToUpdate.Update(request.Title, request.Description, request.StartDate, request.EndDate, coords, location,
      categories, urls);

    updateResult.ThrowIfFailure();

    return new UpdateEventResponse();
  }
}
