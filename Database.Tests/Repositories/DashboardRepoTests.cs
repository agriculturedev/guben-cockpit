using Domain.Tests.DashboardTab;
using Database.Repositories;
using Database.Tests.Extensions;
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

    await repository.AddItemsToDatabase(count);

    var context = dbContextFactory.CreateDbContext();
    await context.SaveChangesAsync();

    // Act
    var result = repository.GetNextSequence();

    // Assert
    result.ShouldBe(count);
  }


}
