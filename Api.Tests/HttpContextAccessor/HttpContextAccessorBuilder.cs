using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace Api.Tests.HttpContextAccessor;

public class HttpContextAccessorBuilder
{
  private readonly List<Claim> _claims = new();

  public HttpContextAccessorBuilder WithKeycloakId(string keycloakId)
  {
    _claims.Add(new Claim(ClaimTypes.NameIdentifier, keycloakId)); // Adjust if GetKeycloakId() uses a different claim type
    return this;
  }

  public HttpContextAccessorBuilder WithClaim(string type, string value)
  {
    _claims.Add(new Claim(type, value));
    return this;
  }

  public HttpContextAccessorBuilder WithDefaultUserClaims()
  {
    WithClaim(ClaimTypes.NameIdentifier, Guid.CreateVersion7().ToString());
    WithClaim(ClaimTypes.GivenName, "testUser");
    WithClaim(ClaimTypes.Surname, "testUser");
    WithClaim(ClaimTypes.Email, "testUser@example.com");
    return this;
  }

  public Microsoft.AspNetCore.Http.HttpContextAccessor Build()
  {
    var identity = new ClaimsIdentity(_claims, "TestAuthType");
    var claimsPrincipal = new ClaimsPrincipal(identity);
    var httpContext = new DefaultHttpContext { User = claimsPrincipal };

    return new Microsoft.AspNetCore.Http.HttpContextAccessor { HttpContext = httpContext };
  }
}
