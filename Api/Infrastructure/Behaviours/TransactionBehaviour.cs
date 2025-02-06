using Database;
using MediatR;
using Shared.Api;
using Shared.Database;

namespace Api.Infrastructure.Behaviours;

public class TransactionBehaviour<TRequest, TResponse>(ICustomDbContextFactory<GubenDbContext> dbContextFactory)
  : IPipelineBehavior<TRequest, TResponse>
  where TRequest : IRequest<TResponse>
{
  public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next,
    CancellationToken cancellationToken)
  {
    if (request is IApiRequestWithCustomTransactions)
    {
      return await next();
    }
    else // use the default transaction handling
    {
      await using var dbContext = dbContextFactory.CreateNew();
      await using var tx = await dbContext.Database.BeginTransactionAsync(cancellationToken)
        .ConfigureAwait(false);
      try
      {
        var response = await next().ConfigureAwait(false);

        await dbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        await tx.CommitAsync(cancellationToken).ConfigureAwait(false);

        return response;
      }
      catch
      {
        await tx.RollbackAsync(cancellationToken).ConfigureAwait(false);
        throw; // Re-throw the exception to maintain the pipeline's behavior.
      }
    }
  }
}
