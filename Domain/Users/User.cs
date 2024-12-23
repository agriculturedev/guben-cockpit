using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.Users;

public sealed class User : Entity<Guid>
{
    public string KeycloakId { get; set; }
    
    private User(string keycloakId)
    {
        Id = Guid.CreateVersion7();
        KeycloakId = keycloakId;
    }

    public static Result<User> Create(string keycloakId)
    {
        return new User( keycloakId );
    }
}