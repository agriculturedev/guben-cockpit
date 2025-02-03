using Domain.Users;

namespace Api.Controllers.Users.Shared;

public struct UserResponse
{
  public required Guid Id { get; set; }
  public required string KeycloakId { get; set; }
  public required string FirstName { get; set; }
  public required string LastName { get; set; }
  public required string Email { get; set; }

  public static UserResponse Map(User user)
  {
    return new UserResponse()
    {
      Id = user.Id,
      KeycloakId = user.KeycloakId,
      FirstName = user.FirstName,
      LastName = user.LastName,
      Email = user.Email,
    };
  }
}
