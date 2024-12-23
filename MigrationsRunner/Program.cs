using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Migrations;

namespace MigrationsRunner;

class Program
{
    private const int SuccessExitCode = 0;
    private const int FailedExitCode = 1;

    static async Task<int> Main(string[] args)
    {
        MigrationResult result;
        using (var host = CreateHostBuilder(args).Build())
        {
            var lifetime = host.Services.GetRequiredService<IHostApplicationLifetime>();
            var configuration = host.Services.GetRequiredService<IConfiguration>();

            using (var scope = host.Services.CreateScope())
            {
                var migrationDeployer = scope.ServiceProvider.GetRequiredService<MigrationDeployer>();

                result = await migrationDeployer.ExecuteAsync();
            }

            if (configuration["wait"] != "true")
                lifetime.StopApplication();

            await host.WaitForShutdownAsync();
        }

        return result.Failed ? FailedExitCode : SuccessExitCode;
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureAppConfiguration((context, config) =>
            {
                config.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                    .AddJsonFile($"appsettings.{context.HostingEnvironment.EnvironmentName}.json", optional: true, reloadOnChange: true)
                    .AddEnvironmentVariables();

                config.AddUserSecrets<Program>();
            })
            .ConfigureServices((_, services) =>
            {
                services.AddMigrations();

                services.AddSingleton<MigrationDeployer>();
            });
}