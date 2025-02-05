using Keycloak.AuthServices.Authentication;
using Keycloak.AuthServices.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;

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

  public static IServiceCollection AddKeycloak2(this IServiceCollection services, Configuration configuration)
  {
    // TODO@JOREN: add keycloak again to mapped config for easy use here
    services
      .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
      .AddJwtBearer(options =>
      {
        options.Authority = "https://your-keycloak-server/auth/realms/your-realm";
        options.Audience = "your-client-id"; // Ensure this matches your Keycloak client ID
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
          ValidateIssuer = true,
          ValidateAudience = true,
          ValidateLifetime = true,
          ValidateIssuerSigningKey = true
        };
      });

    return services;
  }
}
