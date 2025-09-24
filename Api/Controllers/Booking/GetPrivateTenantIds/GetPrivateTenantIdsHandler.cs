using Api.Controllers.Bookings.Shared;
using Api.Infrastructure.Extensions;
using Api.Infrastructure.Keycloak;
using Domain;
using Domain.Booking;
using Domain.Booking.repository;
using Domain.Users.repository;
using Shared.Api;

namespace Api.Controllers.Bookings.GetPrivateTenantIds;

public class GetPrivateTenantIdsHandler : ApiRequestHandler<GetPrivateTenantIdsQuery, GetPrivateTenantIdsResponse>
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IUserRepository _userRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetPrivateTenantIdsHandler(IBookingRepository bookingRepository, IUserRepository userRepository, IHttpContextAccessor httpContextAccessor)
    {
        _bookingRepository = bookingRepository;
        _userRepository = userRepository;
        _httpContextAccessor = httpContextAccessor;
    }

    public override async Task<GetPrivateTenantIdsResponse> Handle(GetPrivateTenantIdsQuery request, CancellationToken cancellationToken)
    {
        var keycloakId = _httpContextAccessor.HttpContext?.User.GetKeycloakId();
		if (string.IsNullOrEmpty(keycloakId))
			throw new UnauthorizedAccessException(TranslationKeys.UserNotLoggedIn);

		var user = await _userRepository.GetByKeycloakId(keycloakId);
		if (user is null)
			throw new ProblemDetailsException(TranslationKeys.UserNotFound);

        var isAdministrativeStaff = _httpContextAccessor.HttpContext?.User.IsInRole(KeycloakPolicies.AdministrativeStaff) ?? false;
        if (!isAdministrativeStaff)
            throw new UnauthorizedAccessException(TranslationKeys.NoAdministrativeStaff);

        List<Booking> tenantIds = await _bookingRepository.GetAllPrivateTenants();

        return new GetPrivateTenantIdsResponse()
        {
            Tenants = tenantIds.Select(TenantResponse.Map).ToList()
        };
    }
}