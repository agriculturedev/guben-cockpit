using Api.Infrastructure.Translations;
using Shared.Api.Translations;

namespace Api;

/// <summary>
/// Installer for the API layer
/// </summary>
public static class ApiInstaller
{
  /// <summary>
  /// Register all API services
  /// </summary>
  /// <param name="services"></param>
  /// <returns></returns>
  public static IServiceCollection AddApi(this IServiceCollection services)
  {
    // register translator, permission service, envelope factory?, mappers, ....
    services.AddSingleton<ITranslator, Translator>();

    return services;
  }
}
