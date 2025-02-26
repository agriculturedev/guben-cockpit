using System.Globalization;

namespace Api.Infrastructure.Translations;

public interface ICultureProvider
{
  CultureInfo GetCulture();
}

public class CultureProvider : ICultureProvider
{
  public CultureInfo GetCulture()
  {
    return CultureInfo.CurrentCulture;
  }
}
