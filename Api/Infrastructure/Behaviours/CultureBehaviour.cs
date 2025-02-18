using System.Globalization;
using Api.Infrastructure.Translations;
using MediatR;

namespace Api.Infrastructure.Behaviours;

public class CultureBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
  where TRequest : IRequest<TResponse>
{
  private readonly IHttpContextAccessor _httpContextAccessor;
  private const string DefaultLanguage = Culture.DefaultLanguage;

  public CultureBehavior(IHttpContextAccessor httpContextAccessor)
  {
    _httpContextAccessor = httpContextAccessor;
  }

  public async Task<TResponse> Handle(
    TRequest request,
    RequestHandlerDelegate<TResponse> next,
    CancellationToken cancellationToken)
  {
    var httpContext = _httpContextAccessor.HttpContext;
    if (httpContext != null &&
        httpContext.Request.Headers.TryGetValue("Accept-Language", out var languages))
    {
      // Get the first language from the header. You might want to implement more robust parsing.
      var language = languages.FirstOrDefault() ?? DefaultLanguage;
      try
      {
        var culture = CultureInfo.GetCultureInfo(language);
        CultureInfo.CurrentCulture = culture;
        CultureInfo.CurrentUICulture = culture;
      }
      catch (CultureNotFoundException)
      {
        // Fallback to default culture if the provided culture is not supported.
        var fallbackCulture = CultureInfo.GetCultureInfo(DefaultLanguage);
        CultureInfo.CurrentCulture = fallbackCulture;
        CultureInfo.CurrentUICulture = fallbackCulture;
      }
    }
    else
    {
      // Fallback to a default culture if no header is present.
      var fallbackCulture = CultureInfo.GetCultureInfo(DefaultLanguage);
      CultureInfo.CurrentCulture = fallbackCulture;
      CultureInfo.CurrentUICulture = fallbackCulture;
    }

    return await next();
  }
}
