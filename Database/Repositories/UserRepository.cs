using Domain.Users;
using Domain.Users.repository;
using Microsoft.EntityFrameworkCore;
using Shared.Database;

namespace Database.Repositories;

public class UserRepository
  : EntityFrameworkRepository<User, Guid, GubenDbContext>, IUserRepository
{
  public UserRepository(ICustomDbContextFactory<GubenDbContext> dbContextFactory)
    : base(dbContextFactory)
  {
    ModifiedSet = Set.Where(p => p.Id != User.SystemUserId);
  }

  public Task<User?> GetByKeycloakId(string keycloakId)
  {
    return ModifiedSet.FirstOrDefaultAsync(u => u.KeycloakId == keycloakId);
  }

  public bool Exists(string keycloakId)
  {
    return ModifiedSet.Any(u => u.KeycloakId == keycloakId);
  }

  public Task<User?> GetByEmailAsync(string email, CancellationToken ct = default)
  {
    var normalized = email.ToLowerInvariant();
    return ModifiedSet.FirstOrDefaultAsync(u => u.Email.ToLower() == normalized, ct);
  }
}
