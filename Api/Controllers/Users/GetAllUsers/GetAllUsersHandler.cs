using Api.Controllers.Users.Shared;
using Domain.Users.repository;
using Shared.Api;

namespace Api.Controllers.Users.GetAllUsers;

public class GetAllUsersHandler : ApiRequestHandler<GetAllUsersQuery, GetAllUsersResponse>,
  IApiRequestWithCustomTransactions, IAuthenticatedApiRequest
{
  private readonly IUserRepository _userRepository;

  public GetAllUsersHandler(IUserRepository userRepository)
  {
    _userRepository = userRepository;
  }

  public override async Task<GetAllUsersResponse> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
  {
    var users = await _userRepository.GetAll(e => new UserResponse()
    {
      Id = e.Id,
      KeycloakId = e.KeycloakId,
    });

    return new GetAllUsersResponse
    {
      Users = users
    };
  }
}
