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

public class GetMyEventsHandler : ApiPagedRequestHandler<GetMyEventsQuery, GetMyEventsResponse, EventResponse>
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
    GetMyEventsResponse events;
    if (isPublisher)
    {
      var pagedResult = await _eventRepository.GetAllEventsPaged(request, _culture);
      events = new GetMyEventsResponse
      {
        PageNumber = pagedResult.PageNumber,
        PageSize = pagedResult.PageSize,
        TotalCount = pagedResult.TotalCount,
        PageCount = pagedResult.PageCount,
        Results = pagedResult.Results.Select(e => EventResponse.Map(e, _culture))
      };
    }
    else
    {
      var pagedResult = await _eventRepository.GetAllEventsPaged(request, _culture, user.Id);
      events = new GetMyEventsResponse
      {
        PageNumber = pagedResult.PageNumber,
        PageSize = pagedResult.PageSize,
        TotalCount = pagedResult.TotalCount,
        PageCount = pagedResult.PageCount,
        Results = pagedResult.Results.Select(e => EventResponse.Map(e, _culture))
      };
    }

    return events;
  }
}
