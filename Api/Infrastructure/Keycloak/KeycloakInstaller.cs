using System.Security.Claims;
using Keycloak.AuthServices.Authentication;
using Keycloak.AuthServices.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;

namespace Api.Infrastructure.Keycloak;

public static class KeycloakInstaller
{
  public static IServiceCollection AddKeycloak(this IServiceCollection services, IConfiguration configuration)
  {
    services.AddKeycloakWebApiAuthentication(configuration, options =>
    {
        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = context =>
            {
                if (context.Principal.Identity is ClaimsIdentity oldIdentity)
                {
                    var newIdentity = new ClaimsIdentity(
                        oldIdentity.Claims, 
                        oldIdentity.AuthenticationType,
                        oldIdentity.NameClaimType,
                        ClaimTypes.Role 
                    );
                    
                    context.Principal = new ClaimsPrincipal(newIdentity);
                }
                return Task.CompletedTask;
            }
        };
    });

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
