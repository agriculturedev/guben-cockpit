using System.Security.Claims;
using Api.Infrastructure.Extensions;
using Database;
using Domain;
using Domain.Users;
using Domain.Users.repository;
using MediatR;
using Shared.Api;
using Shared.Database;

namespace Api.Infrastructure.Behaviours;

public class EnsureUserExistsBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
  where TRequest : IRequest<TResponse>
{
  private readonly ICustomDbContextFactory<GubenDbContext> _dbContextFactory;
  private readonly IUserRepository _userRepository;
  private readonly IHttpContextAccessor _httpContextAccessor;

  public EnsureUserExistsBehavior(ICustomDbContextFactory<GubenDbContext> dbContextFactory,
    IHttpContextAccessor httpContextAccessor, IUserRepository userRepository)
  {
    _dbContextFactory = dbContextFactory;
    _httpContextAccessor = httpContextAccessor;
    _userRepository = userRepository;
  }

  public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next,
    CancellationToken cancellationToken)
  {
    var keycloakId = _httpContextAccessor.HttpContext?.User.GetKeycloakId();

    if (!string.IsNullOrEmpty(keycloakId))
    {
      await using var dbContext = _dbContextFactory.CreateNew();

      var userExists = _userRepository.Exists(keycloakId);

      if (!userExists)
      {
        await using var tx = await dbContext.Database.BeginTransactionAsync(cancellationToken)
          .ConfigureAwait(false);
        try
        {
          var (newUserResult, newUser) = User.Create(keycloakId);
          if (newUserResult.IsFailure)
            throw new ProblemDetailsException(TranslationKeys.CreatingUserFailed);

          await _userRepository.SaveAsync(newUser);
          await dbContext.SaveChangesAsync(cancellationToken);
          await tx.CommitAsync(cancellationToken).ConfigureAwait(false);
        }
        catch
        {
          await tx.RollbackAsync(cancellationToken).ConfigureAwait(false);
          throw; // Re-throw the exception to maintain the pipeline's behavior.
        }
      }
    }

    return await next();
  }
}
