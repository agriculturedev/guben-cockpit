using Api.Infrastructure.Cors;
using Api.Infrastructure.ExceptionHandlers;
using Api.Infrastructure.Hangfire;
using Api.Infrastructure.JsonConverters;
using Api.Infrastructure.Keycloak;
using Api.Infrastructure.MediatR;
using Api.Infrastructure.Nextcloud;
using Api.Infrastructure.OpenApi;
using Api.Infrastructure.Translations;
using Api.Services;
using Database;
using Domain;
using Hangfire;
using Jobs.EventImporter;
using Jobs.ProjectImporter;
using Microsoft.EntityFrameworkCore;
using Shared.Database;

namespace Api;

/// <summary>
/// Startup class for the API which will include all the configurations for the API, services, swagger, mediatr, etc
/// </summary>
/// <param name="configuration"></param>
public class Startup(IConfiguration configuration)
{
  private IConfiguration Configuration { get; } = configuration;
  private Configuration? MappedConfiguration { get; set; }

  /// <summary>
  /// Configures the services for the API, such as authorization, controllers, cors, mediatr, swagger, localization, etc
  /// </summary>
  /// <param name="services"></param>
  /// <exception cref="InvalidOperationException"></exception>
  public void ConfigureServices(IServiceCollection services)
  {
    services.Configure<Configuration>(Configuration);
    MappedConfiguration = Configuration.Get<Configuration>();

    if (MappedConfiguration is null)
      throw new NullReferenceException("Configuration is null");

    if (string.IsNullOrWhiteSpace(MappedConfiguration.ConnectionStrings.DefaultConnection))
      throw new InvalidOperationException("Connection string 'DefaultConnection' not found");

    services.AddHttpContextAccessor();

    services
      .AddDomain()
      .AddServices()
      .AddApi();

    services.AddControllers()
      .AddJsonConverters();

    services.AddNextCloud(MappedConfiguration.Nextcloud);

    services.AddKeycloak(Configuration);
    services.AddCustomCors(MappedConfiguration);
    services.AddCustomHangfire();
    services.AddCustomMediatR();
    services.AddSingleton<ICultureProvider, CultureProvider>();

    services.AddDatabase(Configuration, true);
    services.AddEndpointsApiExplorer();

    ProblemDetailsServiceCollectionExtensions.AddProblemDetails(services);

    services.AddExceptionHandler<ProblemExceptionHandler>();
    services.AddLocalization();
    services.AddOpenApi(options => { options.AddSchemaTransformer<DescribeEnumMemberValues>(); });
  }

  private void AddJobs()
  {
    Console.WriteLine("adding jobs to hangfire...");

    RecurringJob.AddOrUpdate<EventImporter>("EventImporter", (importer) => importer.Import(), Cron.Daily);
    RecurringJob.AddOrUpdate<ProjectImporter>("ProjectImporter", (importer) => importer.Import(), Cron.Daily);

    // Run the jobs immediately on startup, TODO@JOREN: add api endpoints to trigger importer from ui
    // BackgroundJob.Enqueue<EventImporter>(importer => importer.Import());
    // BackgroundJob.Enqueue<ProjectImporter>(importer => importer.Import());
  }

  /// <summary>
  /// Configures the API, such as adding the swagger, exception middleware, request localization, etc
  /// </summary>
  /// <param name="app"></param>
  /// <param name="environment"></param>
  public void Configure(WebApplication app, IHostEnvironment environment)
  {
    app.UseCors("Cors");
    app.UseHttpsRedirection();
    app.UseExceptionHandler();
    app.UseStatusCodePages();

    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();
    app.UseHangfireDashboard();

    app.MapOpenApi()
      .CacheOutput();

    using (var scope = app.Services.CreateScope())
    {
      var dbContextFactory = scope.ServiceProvider.GetRequiredService<ICustomDbContextFactory<GubenDbContext>>();
      var dbContext = dbContextFactory.CreateDbContext();
      dbContext.Database.Migrate();
    }

    AddJobs();

    app.Run();
  }
}
