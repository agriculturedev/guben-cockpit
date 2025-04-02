using System.Globalization;
using System.Runtime.CompilerServices;
using Api.Controllers.Events.Shared;
using Api.Infrastructure.Extensions;
using Api.Infrastructure.Keycloak;
using Domain;
using Domain.Events;
using Domain.Events.repository;
using Domain.Users.repository;
using Shared.Api;

namespace Api.Controllers.Events.GetMyEvents;

public class GetMyEventsHandler : ApiRequestHandler<GetMyEventsQuery, GetMyEventsResponse>
{
  private readonly IEventRepository _eventRepository;
  private readonly CultureInfo _culture;
  private readonly IUserRepository _userRepository;
  private readonly IHttpContextAccessor _httpContextAccessor;

  public GetMyEventsHandler(IEventRepository eventRepository, IHttpContextAccessor httpContextAccessor, IUserRepository userRepository)
  {
    _eventRepository = eventRepository;
    _httpContextAccessor = httpContextAccessor;
    _userRepository = userRepository;
    _culture = CultureInfo.CurrentCulture;
  }

  public override async Task<GetMyEventsResponse> Handle(GetMyEventsQuery request, CancellationToken
      cancellationToken)
  {
    var keycloakId = _httpContextAccessor.HttpContext?.User.GetKeycloakId();
    if (string.IsNullOrEmpty(keycloakId))
      throw new UnauthorizedAccessException(TranslationKeys.UserNotLoggedIn);

    var user = await _userRepository.GetByKeycloakId(keycloakId);
    if (user is null)
      throw new UnauthorizedAccessException(TranslationKeys.UserNotFound);

    var isPublisher = _httpContextAccessor.HttpContext?.User.IsInRole(KeycloakPolicies.PublishEvents) ?? false;

    // if the user is a publisher, allow access to all events
    IEnumerable<Event> events = [];
    if(isPublisher) events = await _eventRepository.GetAll();
    else events = _eventRepository.GetAllOwnedBy(user.Id);

    return new GetMyEventsResponse
    {
      Results = events.Select(e => EventResponse.Map(e, _culture))
    };
  }
}
