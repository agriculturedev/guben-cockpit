using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Protocols.Configuration;

namespace Jobs.Configuration;

public static class ConfigurationExtensions
{
  public static string? GetJobBearerToken(this IConfiguration configuration, string section)
  {
    var token = configuration?.GetSection("Jobs").GetSection(section)["BearerToken"];
    if (string.IsNullOrWhiteSpace(token))
      throw new InvalidConfigurationException("Job bearer token is missing");

    return token;
  }

  public static string? GetLibreTranslateUrl(this IConfiguration configuration, string section)
  {
    var url = configuration?.GetSection("Jobs").GetSection(section)["TranslateUrl"];
    if (string.IsNullOrWhiteSpace(url))
      throw new InvalidConfigurationException("Libre Translate Url is missing");

    return url;
  }

  public static string? GetLibreTranslateApiKey(this IConfiguration configuration, string section)
  {
    var apiKey = configuration?.GetSection("Jobs").GetSection(section)["ApiKey"];
    if (string.IsNullOrWhiteSpace(apiKey))
      throw new InvalidConfigurationException("ApiKey for Libre Translate is missing");

    return apiKey;
  }
}
