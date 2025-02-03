using Domain.Tests.DashboardTab;
using Database.Repositories;
using Shouldly;

namespace Database.Tests.Repositories;

public class DashboardRepoTests
{
  [Theory]
  [InlineData(0)]
  [InlineData(1)]
  [InlineData(2)]
  public async Task GetNextSequence_ShouldReturnNextSequence(int count)
  {
    // Arrange
    var dbContextFactory = new GubenDbContextTestFactory();
    var repository = new DashboardRepository(dbContextFactory);

    await AddItemsToDatabase(repository, count);

    var context = dbContextFactory.CreateDbContext();
    await context.SaveChangesAsync();

    // Act
    var result = repository.GetNextSequence();

    // Assert
    result.ShouldBe(count);
  }

  private static async Task AddItemsToDatabase(DashboardRepository repo, int amount)
  {
    for (int i = 0; i < amount; i++)
    {
      var dashboardTab = new DashboardTabBuilder().WithSequence(i).Build();
      await repo.SaveAsync(dashboardTab);
    }
  }
}
