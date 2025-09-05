using Api.Infrastructure.Extensions;
using Api.Infrastructure.Keycloak;
using Domain;
using Domain.Booking;
using Domain.Booking.repository;
using Domain.Users.repository;
using Shared.Api;

namespace Api.Controllers.Bookings.CreateTenantId;

public class CreateTenantIdHandler : ApiRequestHandler<CreateTenantIdQuery, CreateTenantIdResponse>
{
	private readonly IBookingRepository _bookingRepository;
	private readonly IHttpContextAccessor _httpContextAccessor;
	private readonly IUserRepository _userRepository;

	public CreateTenantIdHandler(IBookingRepository bookingRepository, IHttpContextAccessor httpContextAccessor, IUserRepository userRepository)
	{
		_bookingRepository = bookingRepository;
		_httpContextAccessor = httpContextAccessor;
		_userRepository = userRepository;
	}

	public override async Task<CreateTenantIdResponse> Handle(CreateTenantIdQuery request, CancellationToken cancellationToken)
	{
		var keycloakId = _httpContextAccessor.HttpContext?.User.GetKeycloakId();
		if (keycloakId == null)
			throw new UnauthorizedAccessException(TranslationKeys.UserNotLoggedIn);

		var user = await _userRepository.GetByKeycloakId(keycloakId);
		if (user is null)
			throw new ProblemDetailsException(TranslationKeys.UserNotFound);

		var isBookingManager = _httpContextAccessor.HttpContext?.User.IsInRole(KeycloakPolicies.BookingManager) ?? false;
		if (!isBookingManager)
			throw new UnauthorizedAccessException(TranslationKeys.NoBookingManager);

		var (bookingResult, booking) = Booking.CreateWithGeneratedId(request.TenantId, request.ForPublicUse ?? false);

		bookingResult.ThrowIfFailure();

		await _bookingRepository.SaveAsync(booking);

		return new CreateTenantIdResponse();
	}
}