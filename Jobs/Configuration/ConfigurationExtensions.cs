using Microsoft.Extensions.Configuration;

namespace Jobs.Configuration;

public static class ConfigurationExtensions
{
  public static string? GetJobBearerToken(this IConfiguration configuration, string section)
  {
    return configuration?.GetSection("Jobs").GetSection(section)["BearerToken"];
  }
}
