using Microsoft.Extensions.DependencyInjection;

namespace Domain;

public static class DomainInstaller
{
  public static IServiceCollection AddDomain(this IServiceCollection services)
  {
    // Register all domain services (scoped)
    return services;
  }
}
