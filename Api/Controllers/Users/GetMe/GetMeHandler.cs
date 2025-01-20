using Api.Infrastructure.Extensions;
using Domain;
using Domain.Users.repository;
using Shared.Api;
using Shared.Domain.Validation;

namespace Api.Controllers.Users.GetMe;

public class GetMeHandler : ApiRequestHandler<GetMeQuery, GetMeResponse>, IApiRequestWithCustomTransactions, IAuthenticatedApiRequest
{
  private readonly IUserRepository _userRepository;
  private readonly IHttpContextAccessor _httpContextAccessor;

  public GetMeHandler(IUserRepository userRepository, IHttpContextAccessor httpContextAccessor)
  {
    _userRepository = userRepository;
    _httpContextAccessor = httpContextAccessor;
  }

  public override async Task<GetMeResponse> Handle(GetMeQuery request, CancellationToken cancellationToken)
  {
    var keycloakId = _httpContextAccessor.HttpContext?.User.GetKeycloakId();
    if (keycloakId == null)
      throw new UnauthorizedAccessException(TranslationKeys.UserNotLoggedIn);

    var user = await _userRepository.GetByKeycloakId(keycloakId);
    if (user is null)
      throw new ProblemDetailsException(ValidationMessage.CreateError(TranslationKeys.UserNotFound));

    return new GetMeResponse()
    {
      Id = user.Id,
      KeycloakId = user.KeycloakId,
    };
  }
}
