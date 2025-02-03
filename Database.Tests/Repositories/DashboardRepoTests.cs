using Domain.Tests.DashboardTab;
using Database.Repositories;
using Shouldly;

namespace Database.Tests.Repositories;

public class DashboardRepoTests
{
  [Fact]
  public async Task GetNextSequence_ShouldReturnZeroWhenNoTabsExist()
  {
    // Arrange
    var dbContextFactory = new GubenDbContextTestFactory();
    var repository = new DashboardRepository(dbContextFactory);

    // Act
    var result = repository.GetNextSequence();

    // Assert
    result.ShouldBe(0);
  }

  [Fact]
  public async Task GetNextSequence_ShouldReturnNextSequenceWhenTabsExist()
  {
    // Arrange
    var dbContextFactory = new GubenDbContextTestFactory();
    var repository = new DashboardRepository(dbContextFactory);

    var count = 4;
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
