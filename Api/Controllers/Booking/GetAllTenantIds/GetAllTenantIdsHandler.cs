using Api.Controllers.Bookings.Shared;
using Api.Infrastructure.Extensions;
using Api.Infrastructure.Keycloak;
using Domain;
using Domain.Booking;
using Domain.Booking.repository;
using Domain.Users.repository;
using Shared.Api;

namespace Api.Controllers.Bookings.GetAllTenantIds;

public class GetAllTenantIdsHandler : ApiRequestHandler<GetAllTenantIdsQuery, GetAllTenantIdsResponse>
{
	private readonly IBookingRepository _bookingRepository;
	private readonly IUserRepository _userRepository;
	private readonly IHttpContextAccessor _httpContextAccessor;

	public GetAllTenantIdsHandler(IBookingRepository bookingRepository, IUserRepository userRepository, IHttpContextAccessor httpContextAccessor)
	{
		_bookingRepository = bookingRepository;
		_userRepository = userRepository;
		_httpContextAccessor = httpContextAccessor;
	}

	public override async Task<GetAllTenantIdsResponse> Handle(GetAllTenantIdsQuery request, CancellationToken cancellationToken)
	{
		var keycloakId = _httpContextAccessor.HttpContext?.User.GetKeycloakId();
		if (string.IsNullOrEmpty(keycloakId))
			throw new UnauthorizedAccessException(TranslationKeys.UserNotLoggedIn);

		var user = await _userRepository.GetByKeycloakId(keycloakId);
		if (user is null)
			throw new ProblemDetailsException(TranslationKeys.UserNotFound);

		var isBookingManager = _httpContextAccessor.HttpContext?.User.IsInRole(KeycloakPolicies.BookingManager) ?? false;
		if (!isBookingManager)
			throw new UnauthorizedAccessException(TranslationKeys.NoBookingManager);

		List<Booking> tenantIds = await _bookingRepository.GetAllTenants();

		return new GetAllTenantIdsResponse()
		{
			Tenants = tenantIds.Select(TenantResponse.Map).ToList()
		};
	}
}