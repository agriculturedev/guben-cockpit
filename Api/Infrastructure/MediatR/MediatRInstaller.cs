using System.Reflection;
using Api.Infrastructure.Behaviours;
using MediatR;

namespace Api.Infrastructure.MediatR;

public static class MediatRInstaller
{
  public static IServiceCollection AddCustomMediatR(this IServiceCollection services)
  {
    services.AddMediatR(new MediatRServiceConfiguration()
      .RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

    services.AddTransient(typeof(IPipelineBehavior<,>), typeof(EnsureUserExistsBehavior<,>));
    services.AddTransient(typeof(IPipelineBehavior<,>), typeof(TransactionBehaviour<,>));

    return services;
  }
}
