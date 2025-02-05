using Api.Infrastructure.Cors;
using Api.Infrastructure.ExceptionHandlers;
using Api.Infrastructure.HangFire;
using Api.Infrastructure.JsonConverters;
using Api.Infrastructure.Keycloak;
using Api.Infrastructure.MediatR;
using Api.Infrastructure.OpenApi;
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
      .AddApi();

    services.AddControllers()
      .AddJsonConverters();

    services.AddKeycloak(Configuration);
    services.AddCustomCors(MappedConfiguration);
    services.AddCustomHangfire();
    services.AddCustomMediatR();

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
    BackgroundJob.Enqueue<EventImporter>(importer => importer.Import());
    BackgroundJob.Enqueue<ProjectImporter>(importer => importer.Import());
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

    AddJobs();

    app.MapOpenApi()
      .CacheOutput();

    using (var scope = app.Services.CreateScope())
    {
      var dbContextFactory = scope.ServiceProvider.GetRequiredService<ICustomDbContextFactory<GubenDbContext>>();
      var dbContext = dbContextFactory.CreateDbContext();
      dbContext.Database.Migrate();
    }

    app.Run();
  }
}

// TODO@JOREN: header to wipe all data, local storage, session storage, cookies
// clear-site-data: *
// https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#cookies
// force cookie SECURE flag, otherwise this will be false when running as http (we always run http and use Npm to add https)
// run backend as https.... this will involve some certificate fuckery
// https://chatgpt.com/c/67a3d1b5-084c-800f-bc94-18d628beff4a
// https://medium.com/@hilalyazbek/using-keycloak-to-authenticate-dotnet-applications-cc358ba014bb
