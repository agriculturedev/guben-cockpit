using Shared.Domain;

namespace Domain.Users.repository;

public interface IUserRepository : IRepository<User, Guid>
{
    Task<User?> GetByKeycloakId(string keycloakId);
    bool Exists(string keycloakId);
}