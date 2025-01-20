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
    if (request is not IAuthenticatedApiRequest)
    {
      return await next();
    }

    var keycloakId = _httpContextAccessor.HttpContext?.User.GetKeycloakId();

    if (string.IsNullOrEmpty(keycloakId))
      throw new UnauthorizedAccessException(TranslationKeys.UserNotLoggedIn);

    await using var dbContext = _dbContextFactory.CreateNew();
    var userExists = _userRepository.Exists(keycloakId);

    if (!userExists)
    {
      await using var tx = await dbContext.Database.BeginTransactionAsync(cancellationToken)
        .ConfigureAwait(false);
      try
      {
        var firstName = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.GivenName);
        var lastName = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Surname);
        var email = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Email);

        var (newUserResult, newUser) = User.Create(keycloakId, firstName, lastName, email);
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
    else
    {
      await using var tx = await dbContext.Database.BeginTransactionAsync(cancellationToken)
        .ConfigureAwait(false);
      try
      {
        var user = await _userRepository.GetByKeycloakId(keycloakId);
        if (user is null )
          throw new ProblemDetailsException(TranslationKeys.UserNotFound);

        var firstName = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.GivenName);
        var lastName = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Surname);
        var email = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Email);

        user.Update(firstName, lastName, email);

        await dbContext.SaveChangesAsync(cancellationToken);
        await tx.CommitAsync(cancellationToken).ConfigureAwait(false);
      }
      catch
      {
        await tx.RollbackAsync(cancellationToken).ConfigureAwait(false);
        throw; // Re-throw the exception to maintain the pipeline's behavior.
      }
    }

    return await next();

  }
}
