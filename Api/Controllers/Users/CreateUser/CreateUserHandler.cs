using Domain.Users;
using Domain.Users.repository;
using Shared.Api;

namespace Api.Controllers.Users.CreateUser;

public class CreateUserHandler : ApiRequestHandler<CreateUserQuery, CreateUserResponse>
{
    private readonly IUserRepository _userRepository;
    public CreateUserHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public override Task<CreateUserResponse> Handle(CreateUserQuery request, CancellationToken cancellationToken)
    {
        var (userResult, user) = User.Create(request.KeycloakId);
        if (userResult.IsFailure)
            throw new ProblemDetailsException(userResult);

        _userRepository.Save(user);

        return Task.FromResult(new CreateUserResponse()
        {
            UserId = user.Id
        });
    }
}