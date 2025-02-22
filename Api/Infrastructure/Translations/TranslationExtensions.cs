using System.Globalization;

namespace Api.Infrastructure.Translations;

public static class TranslationExtensions
{
  /// <summary>
  /// Retrieves the translation for the specified language.
  /// Falls back to a default language (e.g., "en") if the requested one isn’t found.
  /// </summary>
  public static T? GetTranslation<T>(this Dictionary<string, T> translations)
    where T : class
  {
    if (translations.TryGetValue(CultureInfo.CurrentCulture.TwoLetterISOLanguageName, out var translation))
      return translation;

    if (translations.TryGetValue(Culture.DefaultLanguage,
          out translation)) // should never be hit, the culture pipeline already has a fallback but just in case
      return translation;

    return null;
  }
}
