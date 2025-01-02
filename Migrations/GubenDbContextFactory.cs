using Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Migrations;

/// <summary>
/// This class is used to construct the DbContext when generating migrations from the commandline
/// </summary>
/// <remarks>https://learn.microsoft.com/en-us/ef/core/cli/dbcontext-creation?tabs=dotnet-core-cli#from-a-design-time-factory</remarks>
internal class GubenDbContextFactory : IDesignTimeDbContextFactory<GubenDbContext>
{
  public GubenDbContext CreateDbContext(string[] args)
  {
    var configuration = new ConfigurationBuilder()
      .SetBasePath(Directory.GetCurrentDirectory())
      .AddJsonFile("appsettings.json")
      .AddUserSecrets("9f889a94c-32c7-47cc-b6ce-06b5778dc3dc")
      .Build();

    var optionsBuilder = new DbContextOptionsBuilder<GubenDbContext>();
    optionsBuilder.UseNpgsql(
      configuration.GetConnectionString("DefaultConnection"),
      options =>
      {
        options.MigrationsAssembly(typeof(GubenDbContextFactory).Assembly.FullName);
        options.MigrationsHistoryTable("Migrations", GubenDbContext.DefaultSchema);
      }
    );

    return new GubenDbContext(optionsBuilder.Options);
  }
}
