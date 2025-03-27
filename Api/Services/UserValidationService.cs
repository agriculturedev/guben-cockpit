using Api.Infrastructure.Extensions;
using Domain;
using Domain.Users;
using Domain.Users.repository;
using Shared.Api;

namespace Api.Services;

public class UserValidationService
{
  private readonly IHttpContextAccessor _httpContextAccessor;
  private readonly IUserRepository _userRepository;

  public UserValidationService(IHttpContextAccessor httpContextAccessor, IUserRepository userRepository)
  {
    _httpContextAccessor = httpContextAccessor;
    _userRepository = userRepository;
  }

  public async Task<User> ValidateUserAsync()
  {
    var keycloakId = _httpContextAccessor.HttpContext?.User.GetKeycloakId();
    if (keycloakId == null)
      throw new UnauthorizedAccessException(TranslationKeys.UserNotLoggedIn);

    var user = await _userRepository.GetByKeycloakId(keycloakId);
    if (user is null)
      throw new ProblemDetailsException(TranslationKeys.UserNotFound);

    return user;
  }
}
