using Domain.Events;
using Domain.Events.repository;
using Microsoft.EntityFrameworkCore;
using Shared.Database;
using Shared.Domain;

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

  public Task<PagedResult<Event>> GetAllEventsPaged(PagedCriteria pagination, EventFilterCriteria filter)
  {
    return Set
      .AsNoTracking()
      .AsSplitQuery()
      .TagWith(nameof(EventRepository) + "." + nameof(GetAllEvents))
      .Include(e => e.Location)
      .Include(e => e.Urls)
      .Include(e => e.Categories)
      .ApplyGetAllFilters(filter)
      .ToPagedResult(pagination);
  }
}

internal static class EventRepositoryExtensions
{
  internal static IQueryable<Event> ApplyGetAllFilters(this IQueryable<Event> query, EventFilterCriteria filter)
  {

    if (!string.IsNullOrWhiteSpace(filter.TitleQuery))
      query = query.Where(w => EF.Functions.Like(w.Title.ToLower(), "%" + filter.TitleQuery.ToLower() + "%"));

    if (filter.StartDateQuery.HasValue && filter.EndDateQuery.HasValue)
    {
      var startDate = filter.StartDateQuery.Value.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
      var endDate = filter.EndDateQuery.Value.ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);
      query = query.Where(w => w.StartDate <= endDate && w.EndDate >= startDate); // any overlap will result in the item being returned
    }

    if (filter.CategoryIdQuery.HasValue)
      query = query.Where(w => w.Categories.Any(cat => cat.Id == filter.CategoryIdQuery.Value));

    if (!string.IsNullOrWhiteSpace(filter.LocationQuery))
      query = query.Where(w => EF.Functions.Like(w.Location.Name.ToLower(), "%" + filter.LocationQuery.ToLower() + "%")
                               || (w.Location.City != null && EF.Functions.Like(w.Location.City.ToLower(), "%" + filter
                               .LocationQuery.ToLower() + "%")));

    return query;
  }
}
