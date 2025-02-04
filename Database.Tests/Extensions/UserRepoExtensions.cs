using System.Security.Claims;
using Database.Repositories;
using Domain;
using Domain.Users;
using Microsoft.AspNetCore.Http;

namespace Database.Tests.Extensions;

public static class UserRepoExtensions
{
  public static async Task AddUserFromHttpContext(this UserRepository repository, HttpContextAccessor httpContextAccessor)
  {
    var keycloakId = httpContextAccessor.HttpContext?.User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value;

    if (string.IsNullOrEmpty(keycloakId))
      throw new UnauthorizedAccessException(TranslationKeys.UserNotLoggedIn);

    var firstName = httpContextAccessor.HttpContext?.User.Claims.First(c => c.Type == ClaimTypes.GivenName).Value;
    var lastName = httpContextAccessor.HttpContext?.User.Claims.First(c => c.Type == ClaimTypes.Surname).Value;
    var email = httpContextAccessor.HttpContext?.User.Claims.First(c => c.Type == ClaimTypes.Email).Value;

    var (newUserResult, newUser) = User.Create(keycloakId, firstName, lastName, email);
    if (newUserResult.IsFailure)
      throw new ArgumentException(newUserResult.ToString());

    await repository.SaveAsync(newUser);
  }
}
