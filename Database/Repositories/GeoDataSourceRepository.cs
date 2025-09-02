using Domain.GeoDataSource;
using Domain.GeoDataSource.repository;
using Domain.Projects;
using Shared.Database;

namespace Database.Repositories;

public class GeoDataSourceRepository
  : EntityFrameworkRepository<GeoDataSource, Guid, GubenDbContext>, IGeoDataSourceRepository
{
  public GeoDataSourceRepository(ICustomDbContextFactory<GubenDbContext> dbContextFactory)
    : base(dbContextFactory)
  {
  }


  public IEnumerable<Project> GetAllGeoDataSources()
  {
    throw new NotImplementedException();
  }
}
