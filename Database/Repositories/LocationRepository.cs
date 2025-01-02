using Domain.Events;
using Domain.Events.repository;
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
}
