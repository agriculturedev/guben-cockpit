using System.Net.Http.Headers;
using Jobs.Configuration;
using Microsoft.Extensions.Configuration;

namespace Jobs.HttpClient;

public static class HttpClientExtensions
{
  public static void AddBearerToken(this System.Net.Http.HttpClient client, IConfiguration configuration, string jobName)
  {
    client.DefaultRequestHeaders.Authorization =
      new AuthenticationHeaderValue("Bearer", configuration.GetJobBearerToken(jobName));
  }
}
