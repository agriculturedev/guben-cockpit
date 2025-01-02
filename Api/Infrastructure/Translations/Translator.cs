using System.Globalization;
using Microsoft.Extensions.Localization;
using Shared.Api.Translations;

namespace Api.Infrastructure.Translations
{
  public class Translator : ITranslator
  {
    private readonly IStringLocalizer<Translations> _localizer;

    public Translator(IStringLocalizer<Translations> localizer)
    {
      _localizer = localizer;
    }

    public string Translate(string key)
    {
      return Translate(key, string.Empty);
    }

    public string Translate(string key, params string[] parameters)
    {
      var result = _localizer.GetString(key, parameters);

      if (result.ResourceNotFound)
      {
        var originalCulture = CultureInfo.CurrentUICulture;
        try
        {
          CultureInfo.CurrentUICulture = Culture.Default;
          var fallbackResult = _localizer.GetString(key, parameters);

          return fallbackResult.ResourceNotFound ? key : fallbackResult.Value;
        }
        finally
        {
          CultureInfo.CurrentUICulture = originalCulture;
        }
      }

      return result.Value;
    }
  }
}
