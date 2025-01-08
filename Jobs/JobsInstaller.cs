using Microsoft.Extensions.DependencyInjection;

namespace Jobs;

public static class JobsInstaller
{
  public static IServiceCollection AddJobs(this IServiceCollection services)
  {
    services.AddSingleton<EventImporter.EventImporter>();
    services.AddSingleton<ProjectImporter.ProjectImporter>();

    return services;
  }
}
