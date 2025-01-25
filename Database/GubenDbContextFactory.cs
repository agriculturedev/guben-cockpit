using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging;
using Shared.Database;

namespace Database;

/// <summary>
/// Creates a new <see cref="DbContext"/> or uses an active one for the active tenant
/// </summary>
public class GubenDbContextFactory : ICustomDbContextFactory<GubenDbContext>
{
  private readonly string _connectionString;
  private GubenDbContext? _dbContext;

  public GubenDbContextFactory(string connectionString)
  {
    _connectionString = connectionString;
    _dbContext = CreateDbContext();
  }

  public GubenDbContext CreateDbContext()
  {
    if (_dbContext is null)
      _dbContext = CreateNew();

    return _dbContext;
  }

  public GubenDbContext CreateNew()
  {
    var dbOptions = new DbContextOptionsBuilder()
      .UseNpgsql(_connectionString)
      .EnableSensitiveDataLogging()
      .LogTo(Console.WriteLine, (eventId, logLevel) => logLevel >= LogLevel.Information
                                                       || eventId == RelationalEventId.DataReaderDisposing);

    _dbContext = new GubenDbContext(dbOptions.Options);

    return _dbContext;
  }

  public void Dispose()
  {
    if (_dbContext is not null)
      _dbContext.Dispose();
  }

  public async ValueTask DisposeAsync()
  {
    if (_dbContext != null)
      await _dbContext.DisposeAsync();
  }
}
