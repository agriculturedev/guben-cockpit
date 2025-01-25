using Microsoft.EntityFrameworkCore;

namespace Shared.Database;

public static class IDbContextFactoryExtensions
{
  public static async Task<T> UseTransaction<T, TDbContext>(this Task<T> task, ICustomDbContextFactory<TDbContext> dbContextFactory) where TDbContext : DbContext
  {
    await using var dbContext = dbContextFactory.CreateNew();

    await using var tx = await dbContext.Database
      .BeginTransactionAsync()
      .ConfigureAwait(false);

    try
    {
      var result = await task;
      await dbContext.SaveChangesAsync().ConfigureAwait(false);
      await tx.CommitAsync().ConfigureAwait(false);
      return result;
    }
    catch
    {
      await tx.RollbackAsync().ConfigureAwait(false);
      throw;
    }
  }

  public static async Task UseTransaction<TDbContext>(this Task task, ICustomDbContextFactory<TDbContext> dbContextFactory) where TDbContext : DbContext
  {
    await using var dbContext = dbContextFactory.CreateNew();

    await using var tx = await dbContext.Database
      .BeginTransactionAsync();

    try
    {
      await task;
      await dbContext.SaveChangesAsync();
      await tx.CommitAsync();
      Console.WriteLine("commit transaction");
    }
    catch
    {
      await tx.RollbackAsync();
      throw;
    }
  }

  public static async Task<T> UseTransaction<T>(this Task<T> task, DbContext dbContext)
  {
    await using var tx = await dbContext.Database
      .BeginTransactionAsync()
      .ConfigureAwait(false);

    try
    {
      var result = await task;
      await dbContext.SaveChangesAsync().ConfigureAwait(false);
      await tx.CommitAsync().ConfigureAwait(false);
      return result;
    }
    catch
    {
      await tx.RollbackAsync().ConfigureAwait(false);
      throw;
    }
  }
}
