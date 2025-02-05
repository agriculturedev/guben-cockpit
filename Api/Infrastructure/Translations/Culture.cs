using System.Globalization;

namespace Api.Infrastructure.Translations;

public static class Culture
{
  public static CultureInfo Dutch => new CultureInfo("nl");
  public static CultureInfo German => new CultureInfo("de");

  /// <summary>
  /// The default culture
  /// </summary>
  public static CultureInfo Default => German;

  /// <summary>
  /// All the supported cultures
  /// </summary>
  public static IList<CultureInfo> SupportedCultures => new List<CultureInfo>
  {
    Dutch,
    German
  };
}
