using Domain.Locations;
using Domain.Locations.repository;
using Microsoft.EntityFrameworkCore;
using Shared.Database;

namespace Database.Repositories;

public class LocationRepository
  : EntityFrameworkRepository<Location, Guid, GubenDbContext>, ILocationRepository
{
  public LocationRepository(ICustomDbContextFactory<GubenDbContext> dbContextFactory)
    : base(dbContextFactory)
  {
  }

  public Location? Find(Location location)
  {
    return Set
      .FirstOrDefault(l =>
        l.Name == location.Name &&
        l.City == location.City &&
        l.Street == location.Street &&
        l.TelephoneNumber == location.TelephoneNumber &&
        l.Fax == location.Fax &&
        l.Email == location.Email &&
        l.Website == location.Website &&
        l.Zip == location.Zip);
  }

  public Task<Location?> FindByName(string name)
  {
    return Set
      .FirstOrDefaultAsync(l =>
        l.Name == name);
  }
}
