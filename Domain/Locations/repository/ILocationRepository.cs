using Shared.Domain;

namespace Domain.Locations.repository;

public interface ILocationRepository : IRepository<Location, Guid>
{
  Guid? Find(Location location);
}
