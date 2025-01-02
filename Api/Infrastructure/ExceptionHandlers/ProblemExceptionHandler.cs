using Api.Infrastructure.Translations;
using Domain;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Shared.Api;
using Shared.Api.Translations;
using Shared.Domain.Validation;

namespace Api.Infrastructure.ExceptionHandlers;

internal sealed class ProblemExceptionHandler : IExceptionHandler
{
  private readonly IProblemDetailsService _problemDetailsService;
  private readonly ITranslator _translator;

  public ProblemExceptionHandler(IProblemDetailsService problemDetailsService, ITranslator translator)
  {
    _problemDetailsService = problemDetailsService;
    _translator = translator;
  }

  public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception,
    CancellationToken cancellationToken)
  {
    httpContext.Response.StatusCode = exception switch
    {
      ApplicationException => StatusCodes.Status400BadRequest,
      _ => StatusCodes.Status500InternalServerError
    };

    httpContext.Response.ContentType = "application/problem+json";

    var problemDetails = new ProblemDetails
    {
      Type = exception.GetType().Name,
      Title = _translator.Translate(TranslationKeys.AnErrorOccured),
      Detail = exception
        .Message, // TODO: dangerous to use in production, could possibly be exploited to see details about system
      // Detail = _translator.Translate(TranslationKeys.ContactDeveloper),
    };

    if (exception is ProblemDetailsException problemDetailsException)
    {
      problemDetails.Detail =
        string.Join(", ", problemDetailsException.ValidationMessages.Select(TranslateValidationMessage));
    }

    return await _problemDetailsService.TryWriteAsync(
      new ProblemDetailsContext()
      {
        HttpContext = httpContext,
        Exception = exception,
        ProblemDetails = problemDetails
      });
  }

  private string TranslateValidationMessage(ValidationMessage validationMessage)
  {
    var key = validationMessage.TranslationKey;
    var translationResult = _translator.Translate(key, validationMessage.Parameters);

    return string.IsNullOrEmpty(translationResult) ? key : translationResult;
  }
}
