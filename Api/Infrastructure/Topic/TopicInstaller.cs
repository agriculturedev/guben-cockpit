using Api;

public static class TopicInstaller
{
  public static IServiceCollection AddTopic(this IServiceCollection services, TopicConfiguration configuration)
  {
    services.AddSingleton(configuration);
    return services;
  }
}