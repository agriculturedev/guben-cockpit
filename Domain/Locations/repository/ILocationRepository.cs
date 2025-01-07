using Shared.Domain;

namespace Domain.Locations.repository;

public interface ILocationRepository : IRepository<Location, Guid>
{
  Location? Find(Location location);
  Task<Location?> FindByName(string name);
}
