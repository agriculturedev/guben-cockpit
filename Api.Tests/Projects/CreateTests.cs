using Api.Controllers.Projects.CreateProject;
using Api.Tests.HttpContextAccessor;
using Database.Repositories;
using Database.Tests;
using Database.Tests.Extensions;
using Domain.Projects;
using Shouldly;

namespace Api.Tests.Projects;

public class ProjectHandlerTests
{
  [Fact]
  public async Task Handle_ShouldCreateProjectAndSaveIt()
  {
    // Arrange
    var dbContextFactory = new GubenDbContextTestFactory();

    using (var context = dbContextFactory.CreateDbContext())
    {
      var projectRepository = new ProjectRepository(dbContextFactory);
      var userRepository = new UserRepository(dbContextFactory);
      var httpContextAccessor = new HttpContextAccessorBuilder().WithDefaultUserClaims().Build();

      await userRepository.AddUserFromHttpContext(httpContextAccessor);
      await context.SaveChangesAsync();

      // Act
      var handler = new CreateProjectHandler(projectRepository, userRepository, httpContextAccessor);
      var query = new CreateProjectQuery() { Title = "Test project", Type = ProjectType.GubenerMarktplatz};

      // Act & Assert
      await Should.NotThrowAsync(async () =>
      {
        await handler.Handle(query, CancellationToken.None);
        await context.SaveChangesAsync(); // instead of transaction behaviour, save manually
      });

      // Assert
      var itemsInRepo = projectRepository.GetAllIncludingUnpublished().ToList();
      itemsInRepo.ShouldNotBeNull().ShouldNotBeEmpty();
      itemsInRepo.Count().ShouldBe(1);
    }
  }

  [Fact]
  public async Task Handle_ShouldFailWhenUserNotLoggedIn()
  {
    // Arrange
    var dbContextFactory = new GubenDbContextTestFactory();

    using (var context = dbContextFactory.CreateDbContext())
    {
      var projectRepository = new ProjectRepository(dbContextFactory);
      var userRepository = new UserRepository(dbContextFactory);
      var httpContextAccessor = new HttpContextAccessorBuilder().Build();

      // Act
      var handler = new CreateProjectHandler(projectRepository, userRepository, httpContextAccessor);
      var query = new CreateProjectQuery() { Title = "Test project", Type = ProjectType.GubenerMarktplatz};

      // Act & Assert
      await Should.ThrowAsync(async () =>
      {
        await handler.Handle(query, CancellationToken.None);
        await context.SaveChangesAsync(); // instead of transaction behaviour, save manually
      }, typeof(UnauthorizedAccessException));

      // Assert
      var itemsInRepo = projectRepository.GetAllIncludingUnpublished().ToList();
      itemsInRepo.ShouldBeEmpty();
    }
  }
}
