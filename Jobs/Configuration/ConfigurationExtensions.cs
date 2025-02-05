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
}
