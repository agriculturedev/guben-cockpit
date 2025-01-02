namespace Shared.Domain.Validation;

public class Result<TValue> : ResultType
{
  public TValue Value { get; }

  private Result(TValue value, IEnumerable<ValidationMessage> validationMessages)
  {
    Value = value;
    ValidationMessages = validationMessages.ToList();
  }

  public static Result<TValue> Ok(TValue value)
    => new Result<TValue>(value, []);

  public Result<TValue> Merge(params Result[] results)
  {
    return new Result<TValue>(Value, ValidationMessages.Concat(results.SelectMany(r => r.ValidationMessages)));
  }

  public void Deconstruct(out bool isSuccessful, out IReadOnlyList<ValidationMessage> messages, out TValue value)
  {
    isSuccessful = IsSuccessful;
    messages = ValidationMessages;
    value = Value;
  }

  public void Deconstruct(out Result validationResult, out TValue value)
  {
    validationResult = Result.Create(ValidationMessages);
    value = Value;
  }

  public Result<TValue> Merge(Result<TValue> result)
  {
    return new Result<TValue>(result.Value, ValidationMessages.Concat(result.ValidationMessages));
  }

  public static implicit operator Result<TValue>(Result result)
  {
    if (result.IsSuccessful)
      throw new NotSupportedException("Cannot implicitly convert to successful result");

    return new Result<TValue>(default, result.ValidationMessages);
  }

  public static implicit operator Result<TValue>(TValue value)
  {
    return Ok(value);
  }
}

public class Result : ResultType
{
  private Result(IEnumerable<ValidationMessage> validationMessages)
  {
    ValidationMessages = validationMessages.ToList();
  }

  /// <summary>
  /// Combines two results into one result
  /// </summary>
  public Result Merge(Result result)
  {
    return new Result(ValidationMessages.Concat(result.ValidationMessages));
  }

  public void Deconstruct(out bool isSuccessful, out IReadOnlyList<ValidationMessage> messages)
  {
    isSuccessful = IsSuccessful;
    messages = ValidationMessages;
  }

  public static Result Create(IEnumerable<ValidationMessage> validationMessages) => new Result(validationMessages);

  public static Result Ok() => new Result([]);

  public static Result<TValue> Ok<TValue>(TValue value) => Result<TValue>.Ok(value);

  public static Result Error(string translationKey, string[] parameters = null)
    => new Result([ValidationMessage.CreateError(translationKey, parameters ?? [])]);

  public static Result Error(string translationKey, params object[] parameters)
    => Error(translationKey, parameters.Select(p => p.ToString()).ToArray());

  public static Result Error(Result result)
    => new Result(result.ValidationMessages);

  /// <summary>
  /// Creates an untyped error Result containing the validation messages of a given typed Result.
  /// </summary>
  public static Result Error<TValue>(Result<TValue> result)
    => new Result(result.ValidationMessages);

  public static Result Warning(string translationKey, string[] parameters = null)
    => new Result([ValidationMessage.CreateWarning(translationKey, parameters ?? [])]);
}

public abstract class ResultType
{
  public bool IsSuccessful => ValidationMessages.All(m => m.SeverityLevel != SeverityLevel.Error);
  public bool IsFailure => !IsSuccessful;
  public IReadOnlyList<ValidationMessage> ValidationMessages { get; protected set; } = null!;

  public override string ToString()
  {
    return string.Join(", ", ValidationMessages.Select(m => m.TranslationKey.ToString()));
  }

  public string ToStringWithParameters()
  {
    return string.Join(", ", ValidationMessages.Select(vm => vm.MapToErrorMessage()));
  }
}
