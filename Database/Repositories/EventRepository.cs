using Domain.Events;
using Domain.Events.repository;
using Microsoft.EntityFrameworkCore;
using Shared.Database;

namespace Database.Repositories;

public class EventRepository
  : EntityFrameworkRepository<Event, int, GubenDbContext>, IEventRepository
{
  public EventRepository(ICustomDbContextFactory<GubenDbContext> dbContextFactory)
    : base(dbContextFactory)
  {
  }

  public IEnumerable<Event> GetAllEvents()
  {
    return Set
      .AsNoTracking()
      .AsSplitQuery()
      .TagWith(nameof(EventRepository) + "." + nameof(GetAllEvents))
      .Include(e => e.Location)
      .Include(e => e.Urls)
      .Include(e => e.Categories)
      .AsEnumerable();
  }
}
