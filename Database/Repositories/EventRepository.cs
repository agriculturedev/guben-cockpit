using System.Globalization;
using Domain;
using Domain.Events;
using Domain.Events.repository;
using Microsoft.EntityFrameworkCore;
using Shared.Database;
using Shared.Domain;

namespace Database.Repositories;

public class EventRepository
  : EntityFrameworkRepository<Event, Guid, GubenDbContext>, IEventRepository
{
  public EventRepository(ICustomDbContextFactory<GubenDbContext> dbContextFactory)
    : base(dbContextFactory) { }

  public Task<Event?> GetByEventIdAndTerminId(string eventId, string terminId)
  {
    return Set
      .Include(e => e.Location)
      .Include(e => e.Urls)
      .Include(e => e.Categories)
      .FirstOrDefaultAsync(e => e.EventId == eventId && e.TerminId == terminId);
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

  public Task<PagedResult<Event>> GetAllEventsPaged(PagedCriteria pagination, EventFilterCriteria filter, CultureInfo cultureInfo)
  {
    return Set
      .AsNoTracking()
      .AsSplitQuery()
      .TagWith(nameof(EventRepository) + "." + nameof(GetAllEvents))
      .Include(e => e.Location)
      .Include(e => e.Urls)
      .Include(e => e.Categories)
      .ApplyGetAllFilters(filter, cultureInfo)
      .ApplySorting(filter, cultureInfo)
      .ToPagedResult(pagination);
  }
}

internal static class EventRepositoryExtensions
{
  internal static IQueryable<Event> ApplyGetAllFilters(this IQueryable<Event> query, EventFilterCriteria filter,
    CultureInfo cultureInfo)
  {
    if (!string.IsNullOrWhiteSpace(filter.TitleQuery))
      query = query.Where(w => EF.Functions.Like(w.Translations[cultureInfo.TwoLetterISOLanguageName].Title.ToLower(),
        "%" + filter.TitleQuery.ToLower() + "%"));

    if (filter.StartDateQuery.HasValue && filter.EndDateQuery.HasValue)
    {
      var startDate = filter.StartDateQuery.Value.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
      var endDate = filter.EndDateQuery.Value.ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);
      query = query.Where(w =>
        w.StartDate <= endDate && w.EndDate >= startDate); // any overlap will result in the item being returned
    }

    if (filter.CategoryIdQuery.HasValue)
      query = query.Where(w => w.Categories.Any(cat => cat.Id == filter.CategoryIdQuery.Value));

    if (filter.LocationQuery?.Length > 0)
      query = query.Where(w =>
        filter.LocationQuery.Any(l =>
          EF.Functions.Like(w.Location.Name, "%" + l + "%")
          || (w.Location.City != null
              && EF.Functions.Like(w.Location.City, "%" + l + "%"))));

    return query;
  }

  internal static IQueryable<Event> ApplySorting(this IQueryable<Event> query, EventFilterCriteria filter,
    CultureInfo cultureInfo)
  {
    if (!filter.SortBy.HasValue || !filter.SortDirection.HasValue)
      return query;

    switch (filter.SortBy)
    {
      case EventSortOption.Title:
        switch (filter.SortDirection)
        {
          case SortDirection.Ascending:
            query = query.OrderBy(w => w.Translations[cultureInfo.TwoLetterISOLanguageName].Title);
            break;
          case SortDirection.Descending:
            query = query.OrderByDescending(w => w.Translations[cultureInfo.TwoLetterISOLanguageName].Title);
            break;
        }

        break;

      case EventSortOption.StartDate:
        switch (filter.SortDirection)
        {
          case SortDirection.Ascending:
            query = query.OrderBy(w => w.StartDate);
            break;
          case SortDirection.Descending:
            query = query.OrderByDescending(w => w.StartDate);
            break;
        }

        break;
    }

    return query;
  }
}
