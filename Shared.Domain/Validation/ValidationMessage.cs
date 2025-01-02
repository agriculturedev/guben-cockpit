namespace Shared.Domain.Validation
{
  public class ValidationMessage
  {
    public SeverityLevel SeverityLevel { get; }
    public string TranslationKey { get; }
    public string[] Parameters { get; }

    protected ValidationMessage(SeverityLevel severityLevel, string translationKey, string[] parameters)
    {
      SeverityLevel = severityLevel;
      TranslationKey = translationKey;
      Parameters = parameters;
    }

    public static ValidationMessage CreateError(string translationKey, string[] parameters)
    {
      return new ValidationMessage(SeverityLevel.Error, translationKey, parameters);
    }

    public static ValidationMessage CreateError(string translationKey, params object[] parameters)
    {
      // TODO@JOREN: why is this complaining? it has fallback value
      return new ValidationMessage(SeverityLevel.Error, translationKey,
        parameters.Select(p => p.ToString()).ToArray() ?? []);
    }

    public static ValidationMessage CreateWarning(string translationKey, string[] parameters)
    {
      return new ValidationMessage(SeverityLevel.Warning, translationKey, parameters);
    }

    public string MapToErrorMessage()
    {
      if (Parameters.Any())
        return
          $"ValidationKey: {TranslationKey} Parameters: {string.Join(", ", Parameters).Replace("{", "{{").Replace("}", "}}")}";

      return $"ValidationKey: {TranslationKey}";
    }
  }

  public class ValidationKey
  {
    public string Key { get; }
    public string TranslationKey { get; }

    private ValidationKey(string key, string translationKey)
    {
      Key = key;
      TranslationKey = translationKey;
    }

    public static ValidationKey Create(string key, string translationKey)
    {
      return new ValidationKey(key, translationKey);
    }
  }
}
