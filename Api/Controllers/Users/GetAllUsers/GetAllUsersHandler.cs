using Api.Controllers.Users.Shared;
using Domain.Users.repository;
using Shared.Api;

namespace Api.Controllers.Users.GetAllUsers;

public class GetAllUsersHandler : ApiPagedRequestHandler<GetAllUsersQuery, GetAllUsersResponse, UserResponse>
{
  private readonly IUserRepository _userRepository;

  public GetAllUsersHandler(IUserRepository userRepository)
  {
    _userRepository = userRepository;
  }

  public override async Task<GetAllUsersResponse> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
  {
    var pagedResult = await _userRepository.GetAllPaged(request);

    return new GetAllUsersResponse
    {
      PageNumber = pagedResult.PageNumber,
      PageSize = pagedResult.PageSize,
      TotalCount = pagedResult.TotalCount,
      PageCount = pagedResult.PageCount,
      Results = pagedResult.Results.Select(UserResponse.Map)
    };
  }
}
