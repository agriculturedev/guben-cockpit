using Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace MigrationsRunner;

public class MigrationDeployer
{
  private readonly ILogger<MigrationDeployer> _logger;
  private readonly IConfiguration _configuration;
  private readonly IMigrationService _migrationService;

  public MigrationDeployer(
    ILogger<MigrationDeployer> logger,
    IConfiguration configuration,
    IMigrationService migrationService)
  {
    _logger = logger;
    _configuration = configuration;
    _migrationService = migrationService;
  }

  public Task<MigrationResult> ExecuteAsync()
  {
    var result = new MigrationResult();

    var dbOptions = new DbContextOptionsBuilder()
      .UseNpgsql(_configuration.GetConnectionString("DefaultConnection"), options =>
      {
        options.MigrationsAssembly(typeof(MigrationService).Assembly.FullName);
        options.MigrationsHistoryTable("Migrations", GubenDbContext.DefaultSchema);
      })
      .LogTo(Console.WriteLine, LogLevel.Information)
      .Options;

    using (var context = new GubenDbContext(dbOptions))
    {
      try
      {
        if (_configuration["destroy"] == "true")
          _migrationService.Destroy(context);

        if (_configuration["revert"] == "true")
          _migrationService.Revert(context);

        if (_configuration["migrate"] != "false")
          _migrationService.Migrate(context);

        context.SaveChanges();
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Migration failed");
        result.Fail();
      }
    }

    return Task.FromResult(result);
  }
}

public class MigrationResult
{
  public bool Failed { get; private set; }

  public void Fail()
  {
    Failed = true;
  }
}
