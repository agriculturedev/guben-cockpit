using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.Logging;

namespace Database;

public interface IMigrationService
{
  void Destroy(GubenDbContext dbContext);
  void Revert(GubenDbContext dbContext);
  void Migrate(GubenDbContext dbContext);
  void RevertAndMigrate(GubenDbContext dbContext);
}

public class MigrationService : IMigrationService
{
  private readonly ILogger<MigrationService> _logger;

  public MigrationService(ILogger<MigrationService> logger)
  {
    _logger = logger;
  }

  public void Destroy(GubenDbContext dbContext)
  {
    _logger.LogWarning("Destroying database.");
    dbContext.Database.EnsureDeleted();
  }

  public void Revert(GubenDbContext dbContext)
  {
    _logger.LogWarning("Reverting migrations.");
    dbContext.GetService<IMigrator>().Migrate("0");
  }

  public void Migrate(GubenDbContext dbContext)
  {
    _logger.LogInformation("Applying migrations.");
    dbContext.Database.Migrate();
  }

  public void RevertAndMigrate(GubenDbContext dbContext)
  {
    Revert(dbContext);
    Migrate(dbContext);
  }
}
