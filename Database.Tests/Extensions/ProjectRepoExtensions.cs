using Database.Repositories;
using Domain.Tests.DashboardTab;
using Domain.Tests.Project;

namespace Database.Tests.Extensions;

internal static class ProjectRepoExtensions
{
  internal static async Task AddItemsToDatabase(this ProjectRepository repo, int amount)
  {
    for (int i = 0; i < amount; i++)
    {
      var project = new ProjectBuilder().Build();
      await repo.SaveAsync(project);
    }
  }
}
