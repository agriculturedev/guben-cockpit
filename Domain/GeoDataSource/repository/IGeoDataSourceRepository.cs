using Domain.Projects;
using Shared.Domain;

namespace Domain.GeoDataSource.repository;

public interface IGeoDataSourceRepository : IRepository<GeoDataSource, Guid>
{
  IEnumerable<Project> GetAllGeoDataSources();
}
