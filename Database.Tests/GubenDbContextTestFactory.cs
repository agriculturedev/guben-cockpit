using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging;
using Shared.Database;

namespace Database.Tests;

public class GubenDbContextTestFactory : ICustomDbContextFactory<GubenDbContext>
{
  private GubenDbContext? _dbContext;

  public GubenDbContextTestFactory()
  {
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
    if (_dbContext is null)
    {
      var dbOptions = new DbContextOptionsBuilder()
        .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // unique database for each test
        .EnableSensitiveDataLogging()
        .LogTo(Console.WriteLine, (eventId, logLevel) => logLevel >= LogLevel.Information
                                                         || eventId == RelationalEventId.DataReaderDisposing);

      _dbContext = new GubenDbContext(dbOptions.Options);
    }

    return _dbContext;
  }

  public void Dispose()
  {
    _dbContext?.Dispose();
  }

  public async ValueTask DisposeAsync()
  {
    if (_dbContext != null) await _dbContext.DisposeAsync();
  }
}
