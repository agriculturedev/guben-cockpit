using Shared.Domain;

namespace Domain.Users.repository;

public interface IUserRepository : IRepository<User, Guid>
{
  Task<User?> GetByKeycloakId(string keycloakId);
  bool Exists(string keycloakId);
  Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);
  Task<User?> GetById(Guid id);
}
