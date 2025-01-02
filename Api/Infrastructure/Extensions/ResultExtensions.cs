using Shared.Api;
using Shared.Domain.Validation;

namespace Api.Infrastructure.Extensions;

public static class ResultExtensions
{
  public static void ThrowIfFailure(this Result result)
  {
    if (result.IsFailure)
      throw new ProblemDetailsException(result);
  }

  public static void ThrowIfFailure<TValue>(this Result<TValue> result)
  {
    if (result.IsFailure)
      throw new ProblemDetailsException<TValue>(result);
  }
}
