using Hangfire.Dashboard;

namespace Api.Infrastructure.HangFire;

public class AuthorizationFilter : IDashboardAuthorizationFilter
{
  public bool Authorize(DashboardContext context)
  {
    return true;
  }
}
