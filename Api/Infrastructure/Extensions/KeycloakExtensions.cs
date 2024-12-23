using System.Security.Claims;

namespace Api.Infrastructure.Extensions;

public static class KeycloakExtensions
{
    public static string? GetKeycloakId(this ClaimsPrincipal user)
    {
        return user.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}
