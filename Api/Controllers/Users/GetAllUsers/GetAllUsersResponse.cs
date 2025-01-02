using Api.Controllers.Users.Shared;

namespace Api.Controllers.Users.GetAllUsers;

public class GetAllUsersResponse
{
  public required IEnumerable<UserResponse> Users { get; set; } = null!;
}
