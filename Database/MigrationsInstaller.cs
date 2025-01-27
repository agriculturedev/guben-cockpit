using Microsoft.Extensions.DependencyInjection;

namespace Database;

public static class MigrationsInstaller
{
  public static IServiceCollection AddMigrations(this IServiceCollection services)
  {
    services.AddTransient<IMigrationService, MigrationService>();

    return services;
  }
}
