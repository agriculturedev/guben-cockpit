using Api.Infrastructure.Extensions;
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

    if (eventToDelete.CreatedBy != user.Id) // TODO@JOREN: or user is EventAdmin
      throw new UnauthorizedAccessException(TranslationKeys.EventNotOwnedByUser);

    _eventRepository.Delete(eventToDelete);

    return new DeleteEventResponse();
  }
}
