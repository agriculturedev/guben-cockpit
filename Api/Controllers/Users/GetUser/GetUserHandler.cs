using Domain;
using Domain.Users.repository;
using Shared.Api;
using Shared.Domain.Validation;

namespace Api.Controllers.Users.GetUser;

public class GetUserHandler : ApiRequestHandler<GetUserQuery, GetUserResponse>, IApiRequestWithCustomTransactions
{
    private readonly IUserRepository _userRepository;

    public GetUserHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public override async Task<GetUserResponse> Handle(GetUserQuery request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByKeycloakId(request.KeycloakId);
        if (user is null)
            throw new ProblemDetailsException(ValidationMessage.CreateError(TranslationKeys.UserNotFound));

        return new GetUserResponse()
        {
            Id = user.Id,
            KeycloakId = user.KeycloakId,
        };
    }
}
