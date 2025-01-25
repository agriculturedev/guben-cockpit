using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Shared.Database;
using Shared.Domain;

namespace Database;

/// <summary>
/// Database installer. This class is used to install the database services into the api.
/// </summary>
public static class DatabaseInstaller
{
  /// <summary>
  /// Add database services.
  /// </summary>
  /// <param name="services"></param>
  /// <param name="configuration"></param>
  /// <param name="isWebApp"></param>
  /// <returns></returns>
  public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration,
    bool isWebApp)
  {
    var connectionString = configuration.GetConnectionString("DefaultConnection");
    if (connectionString == null)
      throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

    services.AddRepositories();
    services.AddScoped<ICustomDbContextFactory<GubenDbContext>, GubenDbContextFactory>(_ =>
      new GubenDbContextFactory(connectionString));

    return services;
  }

  private static void AddRepositories(this IServiceCollection services)
  {
    services.Scan(scan => scan.FromAssemblies(typeof(DatabaseInstaller).Assembly)
      .AddClasses(classes => classes.AssignableTo(typeof(IRepository<,>)))
      .AsImplementedInterfaces()
      .WithScopedLifetime()
    );
  }
}
