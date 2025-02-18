using System.Globalization;

namespace Api.Infrastructure.Translations;

public static class Culture
{
  public static CultureInfo German => new CultureInfo("de");
  public static CultureInfo English => new CultureInfo("en");
  public static CultureInfo Polish => new CultureInfo("pl");

  /// <summary>
  /// The default culture and language string, language string is important for culture behaviour pipeline, needs compile time constant
  /// </summary>
  public static CultureInfo Default => German;
  public const string DefaultLanguage = "de";


  /// <summary>
  /// All the supported cultures
  /// </summary>
  public static IList<CultureInfo> SupportedCultures => new List<CultureInfo>
  {
    German,
    English,
    Polish,
  };
}
