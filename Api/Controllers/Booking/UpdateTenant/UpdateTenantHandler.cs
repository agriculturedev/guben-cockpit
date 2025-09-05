using Api.Infrastructure.Extensions;
using Api.Infrastructure.Keycloak;
using Domain;
using Domain.Booking.repository;
using Domain.Users.repository;
using Shared.Api;

namespace Api.Controllers.Bookings.UpdateTenant;

public class UpdateTenantHandler : ApiRequestHandler<UpdateTenantQuery, UpdateTenantResponse>
{
  private readonly IBookingRepository _bookingRepository;
  private readonly IUserRepository _userRepository;
  private readonly IHttpContextAccessor _httpContextAccessor;

  public UpdateTenantHandler(IBookingRepository bookingRepository, IUserRepository userRepository, IHttpContextAccessor httpContextAccessor)
  {
    _bookingRepository = bookingRepository;
    _userRepository = userRepository;
    _httpContextAccessor = httpContextAccessor;
  }

  public override async Task<UpdateTenantResponse> Handle(UpdateTenantQuery request, CancellationToken cancellationToken)
  {
    if (request.Id is not Guid bookingId)
      throw new ProblemDetailsException(TranslationKeys.MissingTenantId);

    var keycloakId = _httpContextAccessor.HttpContext?.User.GetKeycloakId();
    if (string.IsNullOrEmpty(keycloakId))
      throw new UnauthorizedAccessException(TranslationKeys.UserNotLoggedIn);

    var user = await _userRepository.GetByKeycloakId(keycloakId);
    if (user is null)
      throw new UnauthorizedAccessException(TranslationKeys.UserNotFound);

    var booking = await _bookingRepository.Get(bookingId);
    if (booking is null)
      throw new ProblemDetailsException(TranslationKeys.TenantIdNotFound);

    var isBookingManager = _httpContextAccessor.HttpContext?.User.IsInRole(KeycloakPolicies.BookingManager) ?? false;

    if (!isBookingManager)
      throw new UnauthorizedAccessException(TranslationKeys.NoBookingManager);

    booking.Update(request.TenantId, request.ForPublicUse ?? false);

    return new UpdateTenantResponse();
  }
}