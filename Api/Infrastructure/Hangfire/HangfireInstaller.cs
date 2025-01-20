using Hangfire;
using Hangfire.MemoryStorage;

namespace Api.Infrastructure.HangFire;

public static class HangfireInstaller
{
  public static IServiceCollection AddCustomHangfire(this IServiceCollection services)
  {
    services.AddHangfire(configuration => configuration
      .UseSerilogLogProvider()
      .UseSimpleAssemblyNameTypeSerializer()
      .UseRecommendedSerializerSettings()
      .UseMemoryStorage());

    // Add the processing server as IHostedService
    services.AddHangfireServer();

    return services;
  }
}
