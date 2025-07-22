using Keycloak.AuthServices.Authentication;
using Keycloak.AuthServices.Authorization;
using Microsoft.AspNetCore.Authorization;

namespace Api.Infrastructure.Keycloak;

public static class KeycloakInstaller
{
  public static IServiceCollection AddKeycloak(this IServiceCollection services, IConfiguration configuration)
  {
    services.AddKeycloakWebApiAuthentication(configuration);

    services.AddAuthorization()
      .AddKeycloakAuthorization()
      .AddAuthorizationBuilder()
      .AddAuthorizationPolicies();

    return services;
  }

  public static AuthorizationBuilder AddAuthorizationPolicies(this AuthorizationBuilder authBuilder)
  {
    foreach (var role in KeycloakPolicies.AllRoles)
    {
      authBuilder.AddPolicy(
        role,
        policy => policy.RequireRealmRoles(role)
      );
    }

    authBuilder.AddPolicy("OnlyResiFormClient", policy =>
      policy.RequireClaim("azp", "resi-form")
    );

    return authBuilder;
  }
}
