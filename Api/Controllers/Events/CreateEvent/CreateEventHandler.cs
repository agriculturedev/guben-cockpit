using System.Globalization;
using Api.Infrastructure.Extensions;
using Api.Services;
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
  private readonly UserValidationService _userValidationService;

  public CreateEventHandler(IEventRepository eventRepository, ILocationRepository locationRepository,
    ICategoryRepository categoryRepository, UserValidationService userValidationService)
  {
    _eventRepository = eventRepository;
    _locationRepository = locationRepository;
    _categoryRepository = categoryRepository;
    _userValidationService = userValidationService;
    _culture = CultureInfo.CurrentCulture;
  }

  public override async Task<CreateEventResponse> Handle(CreateEventQuery request, CancellationToken cancellationToken)
  {
    var user = await _userValidationService.ValidateUserAsync();

    var (coordsResult, coords) = Coordinates.Create(request.Latitude, request.Longitude);
    coordsResult.ThrowIfFailure();

    var (urlResult, urls) = request.Urls.Select(url => Url.Create(url.Link, url.Description)).MergeResults();
    urlResult.ThrowIfFailure();

    var (imagesResult, images) = request.Images
      .Select(im => EventImage.Create(im.ThumbnailUrl, im.PreviewUrl, im.OriginalUrl, null, null))
      .MergeResults();
    imagesResult.ThrowIfFailure();

    var location = await _locationRepository.Get(request.LocationId);
    if (location is null)
      throw new ProblemDetailsException(TranslationKeys.LocationNotFound);
    var categories = _categoryRepository.GetByIds(request.CategoryIds).ToList();

    var (eventResult, @event) = Event.CreateWithGeneratedIds(request.Title, request.Description,
      request.StartDate, request.EndDate, location, coords, urls, categories, _culture, user.Id, images);
    eventResult.ThrowIfFailure();

    await _eventRepository.SaveAsync(@event);

    return new CreateEventResponse();
  }
}
