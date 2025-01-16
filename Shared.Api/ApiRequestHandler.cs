using MediatR;

namespace Shared.Api;

public abstract class ApiRequestHandler<TRequest, TResponse> : IRequestHandler<TRequest, TResponse>
  where TRequest : IApiRequest<TResponse>
{
  public abstract Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken);
}

public interface IApiRequest<TResponse> : IRequest<TResponse>
{
}

/// <summary>
/// Marker/Tagging interface to indicate that the handler for the request will manage its own transactions and will not rely on or expect the request pipeline to handle this.
/// </summary>
public interface IApiRequestWithCustomTransactions
{
}

/// <summary>
/// Marker/Tagging interface to indicate that the handler for the request will require a logged in user
/// </summary>
public interface IAuthenticatedApiRequest
{
}

