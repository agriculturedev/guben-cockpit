using System.Globalization;
using Api.Infrastructure.Extensions;
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

namespace Api.Controllers.Events.CreateEvent;

public class CreateEventHandler : ApiRequestHandler<CreateEventQuery, CreateEventResponse>
{
  private readonly IEventRepository _eventRepository;
  private readonly ILocationRepository _locationRepository;
  private readonly ICategoryRepository _categoryRepository;
  private readonly CultureInfo _culture;
  private readonly IUserRepository _userRepository;
  private readonly IHttpContextAccessor _httpContextAccessor;

  public CreateEventHandler(IEventRepository eventRepository, ILocationRepository locationRepository,
    ICategoryRepository categoryRepository, IUserRepository userRepository, IHttpContextAccessor httpContextAccessor)
  {
    _eventRepository = eventRepository;
    _locationRepository = locationRepository;
    _categoryRepository = categoryRepository;
    _userRepository = userRepository;
    _httpContextAccessor = httpContextAccessor;
    _culture = CultureInfo.CurrentCulture;
  }

  public override async Task<CreateEventResponse> Handle(CreateEventQuery request, CancellationToken cancellationToken)
  {
    var keycloakId = _httpContextAccessor.HttpContext?.User.GetKeycloakId();
    if (keycloakId == null)
      throw new UnauthorizedAccessException(TranslationKeys.UserNotLoggedIn);

    var user = await _userRepository.GetByKeycloakId(keycloakId);
    if (user is null)
      throw new ProblemDetailsException(TranslationKeys.UserNotFound);

    var (coordsResult, coords) = Coordinates.Create(request.Latitude, request.Longitude);
    coordsResult.ThrowIfFailure();

    var (urlResult, urls) = request.Urls.Select(url => Url.Create(url.Link, url.Description)).MergeResults();
    urlResult.ThrowIfFailure();

    var location = await _locationRepository.Get(request.LocationId);
    if (location is null)
      throw new ProblemDetailsException(TranslationKeys.LocationNotFound);
    var categories = _categoryRepository.GetByIds(request.CategoryIds).ToList();

    var (eventResult, @event) = Event.CreateWithGeneratedIds(request.Title, request.Description,
      request.StartDate, request.EndDate, location, coords, urls, categories, _culture, user.Id);
    eventResult.ThrowIfFailure();

    await _eventRepository.SaveAsync(@event);

    return new CreateEventResponse();
  }
}
