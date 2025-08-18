using Api.Infrastructure.Extensions;
using Api.Infrastructure.Keycloak;
using Domain;
using Domain.Events.repository;
using Domain.Users.repository;
using Shared.Api;

namespace Api.Controllers.Events.DeleteEvent;

public class DeleteEventHandler : ApiRequestHandler<DeleteEventQuery, DeleteEventResponse>
{
  private readonly IEventRepository _eventRepository;
  private readonly IUserRepository _userRepository;
  private readonly IHttpContextAccessor _httpContextAccessor;
  public DeleteEventHandler(IEventRepository eventRepository, IUserRepository userRepository, IHttpContextAccessor httpContextAccessor)
  {
    _eventRepository = eventRepository;
    _userRepository = userRepository;
    _httpContextAccessor = httpContextAccessor;
  }

  public override async Task<DeleteEventResponse> Handle(DeleteEventQuery request, CancellationToken cancellationToken)
  {
    var keycloakId = _httpContextAccessor.HttpContext?.User.GetKeycloakId();
    if (keycloakId == null)
      throw new UnauthorizedAccessException(TranslationKeys.UserNotLoggedIn);

    var user = await _userRepository.GetByKeycloakId(keycloakId);
    if (user is null)
      throw new ProblemDetailsException(TranslationKeys.UserNotFound);

    var eventToDelete = await _eventRepository.GetIncludingUnpublished(request.Id);
    if (eventToDelete is null)
      throw new ProblemDetailsException(TranslationKeys.EventNotFound);

    var isDeleter = _httpContextAccessor.HttpContext?.User.IsInRole(KeycloakPolicies.DeleteEvent) ?? false;

    if (eventToDelete.CreatedBy != user.Id && !isDeleter)
      throw new UnauthorizedAccessException(TranslationKeys.EventNotOwnedByUser);


    //Okay following Problem here
    //If the Event gets imported every 24h and we deleted it will just be created anew
    //therefore, if it was created by the Backend (CreatedBy 00000000-0000-0000-0000-000000000000) we just flag it as deleted
    if (eventToDelete.CreatedBy == Guid.Empty)
    {
      eventToDelete.Delete();
      _eventRepository.Save(eventToDelete);
    }
    else
    {
      _eventRepository.Delete(eventToDelete);      
    }

    return new DeleteEventResponse();
  }
}
