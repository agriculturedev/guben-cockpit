namespace Api.Infrastructure.Translations;

public static class TranslationExtensions
{
  /// <summary>
  /// Retrieves the translation for the specified language.
  /// Falls back to a default language (e.g., "en") if the requested one isn’t found.
  /// </summary>
  public static T? GetTranslation<T>(
    this Dictionary<string, T> translations,
    string language)
    where T : class
  {
    if (translations.TryGetValue(language, out var translation))
      return translation;

    if (translations.TryGetValue(Culture.DefaultLanguage, out translation))
      return translation;

    return null;
  }
}
