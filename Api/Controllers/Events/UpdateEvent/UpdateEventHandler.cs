using Api.Infrastructure.Extensions;
using Api.Infrastructure.Keycloak;
using Api.Infrastructure.Translations;
using Domain;
using Domain.Category.repository;
using Domain.Coordinates;
using Domain.Events;
using Domain.Events.repository;
using Domain.Locations.repository;
using Domain.Urls;
using Domain.Users.repository;
using Shared.Api;
using Shared.Domain.Validation;

namespace Api.Controllers.Events.UpdateEvent;

public class UpdateEventHandler : ApiRequestHandler<UpdateEventQuery, UpdateEventResponse>
{
  private readonly IEventRepository _eventRepository;
  private readonly ILocationRepository _locationRepository;
  private readonly ICategoryRepository _categoryRepository;
  private readonly ICultureProvider _cultureProvider;
  private readonly IHttpContextAccessor _httpContextAccessor;
  private readonly IUserRepository _userRepository;

  public UpdateEventHandler(IEventRepository eventRepository, ICategoryRepository categoryRepository,
    ILocationRepository locationRepository, ICultureProvider cultureProvider, IHttpContextAccessor httpContextAccessor,
    IUserRepository userRepository)
  {
    _eventRepository = eventRepository;
    _categoryRepository = categoryRepository;
    _locationRepository = locationRepository;
    _cultureProvider = cultureProvider;
    _httpContextAccessor = httpContextAccessor;
    _userRepository = userRepository;
  }

  public override async Task<UpdateEventResponse> Handle(UpdateEventQuery request, CancellationToken cancellationToken)
  {
    if (request.Id == null)
    {
      throw new ProblemDetailsException(TranslationKeys.MissingEventId);
    }

    var keycloakId = _httpContextAccessor.HttpContext?.User.GetKeycloakId();
    if (string.IsNullOrEmpty(keycloakId))
      throw new UnauthorizedAccessException(TranslationKeys.UserNotLoggedIn);

    var user = await _userRepository.GetByKeycloakId(keycloakId);
    if (user is null)
      throw new UnauthorizedAccessException(TranslationKeys.UserNotFound);

    var eventToUpdate = await _eventRepository.GetWithEverythingById(request.Id.Value);
    if (eventToUpdate is null)
      throw new ProblemDetailsException(TranslationKeys.EventNotFound);

    var isEditor = _httpContextAccessor.HttpContext?.User.IsInRole(KeycloakPolicies.EditEvents) ?? false;

    if (eventToUpdate.CreatedBy != user.Id && !isEditor)
      throw new UnauthorizedAccessException(TranslationKeys.EventNotOwnedByUser);

    var (coordsResult, coords) = Coordinates.Create(request.Latitude, request.Longitude);
    coordsResult.ThrowIfFailure();

    var (urlResult, urls) = request.Urls.Select(url => Url.Create(url.Link, url.Description)).MergeResults();
    urlResult.ThrowIfFailure();

    var (imagesResult, images) = request.Images.Select(im => EventImage.Create(im.ThumbnailUrl, im.PreviewUrl, im.OriginalUrl, null, null)).MergeResults();
    imagesResult.ThrowIfFailure();

    var location = await _locationRepository.Get(request.LocationId);
    if (location is null)
      throw new ProblemDetailsException(TranslationKeys.LocationNotFound);

    var categories = _categoryRepository.GetByIds(request.CategoryIds).ToList();
    if (categories is null)
      throw new ProblemDetailsException(TranslationKeys.CategoryNotFound);

    var (i18NResult, i18NData) = EventI18NData.Create(request.Title, request.Description);
    i18NResult.ThrowIfFailure();

    var updateResult = eventToUpdate.Update(i18NData, request.StartDate, request.EndDate, coords, location, categories,
      urls, _cultureProvider.GetCulture(), images);

    updateResult.ThrowIfFailure();

    return new UpdateEventResponse();
  }
}
