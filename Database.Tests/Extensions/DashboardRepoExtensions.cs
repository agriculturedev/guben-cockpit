using Database.Repositories;
using Domain.Tests.DashboardTab;

namespace Database.Tests.Extensions;

internal static class DashboardRepoExtensions
{
  internal static async Task AddItemsToDatabase(this DashboardRepository repo, int amount)
  {
    for (int i = 0; i < amount; i++)
    {
      var dashboardTab = new DashboardTabBuilder().WithSequence(i).Build();
      await repo.SaveAsync(dashboardTab);
    }
  }
}
