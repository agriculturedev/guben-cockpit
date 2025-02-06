using Database;
using Microsoft.EntityFrameworkCore;
using Shared.Database;

namespace Jobs;

internal static class ImporterTransactions
{
  internal static async Task ExecuteTransactionAsync(ICustomDbContextFactory<GubenDbContext> dbContextFactory, Func<DbContext, Task> action)
  {
    await using var dbContext = dbContextFactory.CreateNew();
    await using var transaction = await dbContext.Database.BeginTransactionAsync();
    try
    {
      await action(dbContext);
      await dbContext.SaveChangesAsync();
      await transaction.CommitAsync();
    }
    catch
    {
      await transaction.RollbackAsync();
      throw;
    }
  }
}
