namespace Api.Infrastructure.Cors;

public static class CorsInstaller
{
  public static IServiceCollection AddCustomCors(this IServiceCollection services, Configuration configuration)
  {
    services.AddCors(options =>
    {
      options.AddPolicy("Cors",
        builder =>
        {
          builder.WithOrigins("http://localhost:5000", configuration.Frontend.BaseUri, configuration.ResiForm.BaseUri)
            .AllowAnyHeader()
            .AllowAnyMethod();
        });
    });

    return services;
  }
}
