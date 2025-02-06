using Shared.Domain.Validation;

namespace Shared.Api;

[Serializable]
public sealed class ProblemDetailsException : Exception
{
  public IReadOnlyList<ValidationMessage> ValidationMessages { get; }

  public ProblemDetailsException(Result result)
  {
    ValidationMessages = result.ValidationMessages;
  }

  public ProblemDetailsException(ValidationMessage validationMessage)
  {
    ValidationMessages = [validationMessage];
  }

  public ProblemDetailsException(string validationMessage)
  {
    ValidationMessages = [ValidationMessage.CreateError(validationMessage)];
  }
}

[Serializable]
public sealed class ProblemDetailsException<TValue> : Exception
{
  public IReadOnlyList<ValidationMessage> ValidationMessages { get; }

  public ProblemDetailsException(Result<TValue> result)
  {
    ValidationMessages = result.ValidationMessages;
  }
}
