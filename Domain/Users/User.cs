using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.Users;

public sealed class User : Entity<Guid>
{
  public static Guid SystemUserId = Guid.Empty;

  public string KeycloakId { get; set; }
  public string FirstName { get; set; }
  public string LastName { get; set; }
  public string Email { get; set; }

  private User(string keycloakId, string? firstName, string? lastName, string? email)
  {
    Id = Guid.CreateVersion7();
    KeycloakId = keycloakId;
    FirstName = firstName ?? "";
    LastName = lastName ?? "";
    Email = email ?? "";
  }

  public static Result<User> Create(string keycloakId, string? firstName, string? lastName, string? email)
  {
    return new User(keycloakId, firstName, lastName, email);
  }

  public void Update(string? firstName, string? lastName, string? email)
  {
    FirstName = firstName ?? "";
    LastName = lastName ?? "";
    Email = email ?? "";
  }

  public static readonly User SystemUser = new User("system", "System", "User", "system@example.com")
  {
    Id = SystemUserId // Predefined GUID for the system user
  };
}
