using Api.Controllers.Projects.DeleteTenantId;
using Api.Infrastructure.Extensions;
using Api.Infrastructure.Keycloak;
using Domain;
using Domain.Booking.repository;
using Domain.Users.repository;
using Shared.Api;

namespace Api.Controllers.Bookings.DeleteTenantId;

public class DeleteTenantIdHandler : ApiRequestHandler<DeleteTenantIdQuery, DeleteTenantIdResponse>
{
	private readonly IBookingRepository _bookingRepository;
	private readonly IUserRepository _userRepository;
	private readonly IHttpContextAccessor _httpContextAccessor;

	public DeleteTenantIdHandler(IBookingRepository bookingRepository, IUserRepository userRepository, IHttpContextAccessor httpContextAccessor)
	{
		_bookingRepository = bookingRepository;
		_userRepository = userRepository;
		_httpContextAccessor = httpContextAccessor;
	}

	public override async Task<DeleteTenantIdResponse> Handle(DeleteTenantIdQuery request, CancellationToken cancellationToken)
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

		var tenantIdToDelete = await _bookingRepository.Get(request.Id);
		if (tenantIdToDelete is null)
			throw new ProblemDetailsException(TranslationKeys.TenantIdNotFound);

		_bookingRepository.Delete(tenantIdToDelete);

		return new DeleteTenantIdResponse();
	}
}