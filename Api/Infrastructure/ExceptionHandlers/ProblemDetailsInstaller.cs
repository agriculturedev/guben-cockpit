using System.Diagnostics;
using Microsoft.AspNetCore.Http.Features;

namespace Api.Infrastructure.ExceptionHandlers;

public static class ProblemDetailsInstaller
{
  public static IServiceCollection AddProblemDetails(this IServiceCollection services)
  {
    services.AddProblemDetails(options =>
    {
      options.CustomizeProblemDetails = context =>
      {
        Activity? activity = context.HttpContext.Features.Get<IHttpActivityFeature>()?.Activity;

        context.ProblemDetails.Instance = $"{context.HttpContext.Request.Method} {context.HttpContext.Request.Path}";
        context.ProblemDetails.Extensions.Add("requestId", context.HttpContext.TraceIdentifier);
      };
    });

    return services;
  }
}
