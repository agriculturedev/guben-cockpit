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
    authBuilder.AddPolicy(
      KeycloakPolicies.ViewUsers,
      policy => policy.RequireRealmRoles(KeycloakPolicies.ViewUsers)
    );

    authBuilder.AddPolicy(
      KeycloakPolicies.PublishProjects,
      policy => policy.RequireRealmRoles(KeycloakPolicies.PublishProjects)
    );

    return authBuilder;
  }
}
