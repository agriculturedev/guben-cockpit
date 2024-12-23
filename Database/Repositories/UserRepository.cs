using Domain.Users;
using Domain.Users.repository;
using Microsoft.EntityFrameworkCore;
using Shared.Database;

namespace Database.Repositories;

public class UserRepository
    : EntityFrameworkRepository<User, Guid, GubenDbContext>, IUserRepository
{
    public UserRepository(ICustomDbContextFactory<GubenDbContext> dbContextFactory)
        : base(dbContextFactory) { }


    public Task<User?> GetByKeycloakId(string keycloakId)
    {
        return Set.FirstOrDefaultAsync(u => u.KeycloakId == keycloakId);
    }

    public bool Exists(string keycloakId)
    {
        return Set.Any(u => u.KeycloakId == keycloakId);
    }
}