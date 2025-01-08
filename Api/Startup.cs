using System.Diagnostics;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using Api.Infrastructure.Behaviours;
using Api.Infrastructure.ExceptionHandlers;
using Api.Infrastructure.JsonConverters;
using Api.Infrastructure.OpenApi;
using Database;
using Domain;
using Hangfire;
using Hangfire.MemoryStorage;
using Jobs.EventImporter;
using Jobs.ProjectImporter;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.IdentityModel.Tokens;

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
      .AddJsonOptions(options =>
      {
        var assembly = Assembly.GetExecutingAssembly();

        var dataContractEnums = assembly.GetTypes()
          .Where(type => type.IsEnum)
          .Where(type => type.GetCustomAttributes(typeof(DataContractAttribute), false).Any());

        foreach (var enumType in dataContractEnums)
        {
          var converterType = typeof(EnumMemberConverter<>).MakeGenericType(enumType);
          var converter = Activator.CreateInstance(converterType);
          if (converter is null) throw new NullReferenceException("JsonConverter is null");
          options.JsonSerializerOptions.Converters.Add((JsonConverter)converter);
        }
      });

    services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
      .AddJwtBearer(options =>
      {
        options.Authority = MappedConfiguration.Jwt.Authority;
        options.Audience = MappedConfiguration.Jwt.Audience;
        options.RequireHttpsMetadata = false; // TODO: true for production
        options.TokenValidationParameters = new TokenValidationParameters
        {
          // ValidateIssuerSigningKey = true,
          RoleClaimType = "roles", // Use Keycloak's role claim
          NameClaimType = "preferred_username" // Map to Keycloak's username claim
        };
      });

    services.AddAuthorization();

    services.AddCors(options =>
    {
      options.AddPolicy("AllowReactApp",
        builder =>
        {
          builder.WithOrigins(MappedConfiguration.Frontend.BaseUri)
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

    services.AddHangfire(configuration => configuration
      .UseSerilogLogProvider()
      .UseSimpleAssemblyNameTypeSerializer()
      .UseRecommendedSerializerSettings()
      .UseMemoryStorage());

    // Add the processing server as IHostedService
    services.AddHangfireServer();

    services.AddMediatR(new MediatRServiceConfiguration()
      .RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

    services.AddDatabase(Configuration, true);
    services.AddTransient(typeof(IPipelineBehavior<,>), typeof(EnsureUserExistsBehavior<,>));
    services.AddTransient(typeof(IPipelineBehavior<,>), typeof(TransactionBehaviour<,>));
    services.AddEndpointsApiExplorer();

    services.AddProblemDetails(options =>
    {
      options.CustomizeProblemDetails = context =>
      {
        Activity? activity = context.HttpContext.Features.Get<IHttpActivityFeature>()?.Activity;

        context.ProblemDetails.Instance = $"{context.HttpContext.Request.Method} {context.HttpContext.Request.Path}";
        context.ProblemDetails.Extensions.Add("requestId", context.HttpContext.TraceIdentifier);
      };
    });

    services.AddAntiforgery(); // TODO: investigage, does this need further configuration?
    services.AddExceptionHandler<ProblemExceptionHandler>();
    services.AddLocalization();
    services.AddOpenApi(options => { options.AddSchemaTransformer<DescribeEnumMemberValues>(); });
  }

  private void AddJobs()
  {
    Console.WriteLine("adding jobs to hangfire...");

    RecurringJob.AddOrUpdate<EventImporter>("EventImporter", (importer) => importer.Import(), Cron.Daily);
    RecurringJob.AddOrUpdate<ProjectImporter>("ProjectImporter", (importer) => importer.Import(), Cron.Daily);
  }

  /// <summary>
  /// Configures the API, such as adding the swagger, exception middleware, request localization, etc
  /// </summary>
  /// <param name="app"></param>
  /// <param name="environment"></param>
  public void Configure(WebApplication app, IHostEnvironment environment)
  {
    app.UseCors("AllowReactApp");
    app.UseCors("AllowSelf");
    app.UseHttpsRedirection();
    app.UseAntiforgery();
    app.UseExceptionHandler();
    app.UseStatusCodePages();

    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();
    app.UseHangfireDashboard();

    AddJobs();

    app.MapOpenApi()
      .CacheOutput();

    app.Run();
  }
}
