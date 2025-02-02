using Api.Controllers.DashboardTabs.CreateDashboardTab;
using Database.Repositories;
using Database.Tests;
using Shouldly;

namespace Api.Tests.DashboardTabs;

public class DashboardRepositoryTests
{
  [Fact]
  public async Task Handle_ShouldCreateDashboardTabAndSaveIt()
  {
    // Arrange
    var dbContextFactory = new GubenDbContextTestFactory();

    using (var context = dbContextFactory.CreateDbContext())
    {
      var repository = new DashboardRepository(dbContextFactory);
      var handler = new CreateDashboardTabHandler(repository);

      var query = new CreateDashboardTabQuery { Title = "Test Tab", MapUrl = "https://test.com" };

      // Act
      var response = await handler.Handle(query, CancellationToken.None);

      // Assert
      response.ShouldNotBeNull();

      await context.SaveChangesAsync();
      // Use the SAME DbContext instance to verify the save
      var itemsInRepo = await repository.GetAll();
      itemsInRepo.ShouldNotBeNull().ShouldNotBeEmpty();
      itemsInRepo.Count.ShouldBe(1);
    }
  }
}
