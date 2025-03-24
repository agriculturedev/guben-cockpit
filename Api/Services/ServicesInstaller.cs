namespace Api.Services;

public static class ServicesInstaller
{
  public static IServiceCollection AddServices(this IServiceCollection services)
  {
    services.AddScoped<UserValidationService>();

    return services;
  }
}
