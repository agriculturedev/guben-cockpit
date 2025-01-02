using Api.Shared.Entity;
using Domain;
using Domain.Users;

namespace Api.Controllers.Users.Shared;

public class UserResponse : EntityResponse
{
  public required string KeycloakId { get; set; }

  public static UserResponse Map(User user)
  {
    return new UserResponse()
    {
      Id = user.Id,
      KeycloakId = user.KeycloakId
    };
  }
}
