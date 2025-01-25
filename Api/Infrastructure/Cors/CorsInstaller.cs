namespace Api.Infrastructure.Cors;

public static class CorsInstaller
{
  public static IServiceCollection AddCustomCors(this IServiceCollection services, Configuration configuration)
  {
    services.AddCors(options =>
    {
      options.AddPolicy("AllowReactApp",
        builder =>
        {
          builder.WithOrigins(configuration.Frontend.BaseUri)
            .AllowAnyHeader()
            .AllowAnyMethod();
        });
      options.AddPolicy("AllowSelf",
        builder =>
        {
          builder.WithOrigins("http://localhost:5000")
            .AllowAnyHeader()
            .AllowAnyMethod();
        });
    });

    return services;
  }
}
