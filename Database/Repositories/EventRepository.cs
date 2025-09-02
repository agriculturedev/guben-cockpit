using System.Globalization;
using Domain;
using Domain.Events;
using Domain.Events.repository;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Shared.Database;
using Shared.Domain;

namespace Database.Repositories;

// TODO@JOREN: simplify below, use EF where possible instead of raw sql

public class EventRepository
  : EntityFrameworkRepository<Event, Guid, GubenDbContext>, IEventRepository
{
  public EventRepository(ICustomDbContextFactory<GubenDbContext> dbContextFactory)
    : base(dbContextFactory)
  {
    ModifiedSet = Set.Where(p => p.Published);
  }

  public Task<Event?> GetIncludingUnpublished(Guid id)
  {
    return Set
      .TagWith(GetType().Name + '.' + nameof(GetIncludingUnpublished))
      .IgnoreAutoIncludes()
      .FirstOrDefaultAsync(a => a.Id.Equals(id));
  }

  public Task<Event?> GetWithEverythingById(Guid id)
  {
    return Set
      .TagWith(GetType().Name + '.' + nameof(GetWithEverythingById))
      .Include(e => e.Categories)
      .Include(e => e.Location)
      .Include(e => e.Images)
      .Include(e => e.Urls)
      .IgnoreAutoIncludes()
      .FirstOrDefaultAsync(e => e.Id.Equals(id));
  }

  public Task<Event?> GetById(Guid id)
  {
    return Set
      .TagWith(GetType().Name + '.' + nameof(GetById))
      .Include(e => e.Location)
      .Include(e => e.Urls)
      .Include(e => e.Categories)
      .FirstOrDefaultAsync(e => e.Id.Equals(id));
  }

  public IEnumerable<Event> GetAllIncludingUnpublished()
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

  public IEnumerable<Event> GetAllByIdsIncludingUnpublished(IList<Guid> ids)
  {
    return Set
      .TagWith(nameof(EventRepository) + "." + nameof(GetAllByIdsIncludingUnpublished))
      .Where(p => ids.Contains(p.Id))
      .AsEnumerable();
  }

  public Task<Event?> GetByEventIdAndTerminId(string eventId, string terminId)
  {
    // TODO@JOREN: modifiedSet or not?
    return ModifiedSet
      .AsSplitQuery()
      .TagWith(nameof(EventRepository) + "." + nameof(GetByEventIdAndTerminId))
      .Include(e => e.Location)
      .Include(e => e.Urls)
      .Include(e => e.Categories)
      .FirstOrDefaultAsync(e => e.EventId == eventId && e.TerminId == terminId);
  }

  public Task<Event?> GetByEventIdAndTerminIdIncludingDeletedAndUnpublished(string eventId, string terminId)
  {
    return Set
      .AsSplitQuery()
      .TagWith(nameof(EventRepository) + "." + nameof(GetByEventIdAndTerminIdIncludingDeletedAndUnpublished))
      .IgnoreQueryFilters()
      .Include(e => e.Location)
      .Include(e => e.Urls)
      .Include(e => e.Categories)
      .FirstOrDefaultAsync(e => e.EventId == eventId && e.TerminId == terminId);
  }

  public IEnumerable<Event> GetAllEvents()
  {
    return ModifiedSet
      .AsNoTracking()
      .AsSplitQuery()
      .TagWith(nameof(EventRepository) + "." + nameof(GetAllEvents))
      .Include(e => e.Location)
      .Include(e => e.Urls)
      .Include(e => e.Categories)
      .AsEnumerable();
  }

  public IEnumerable<Event> GetAllOwnedBy(Guid userId)
  {
    return Set
      .AsNoTracking()
      .AsSplitQuery()
      .TagWith(nameof(EventRepository) + "." + nameof(GetAllOwnedBy))
      .Include(e => e.Location)
      .Include(e => e.Urls)
      .Include(e => e.Categories)
      .Where(e => e.CreatedBy == userId)
      .AsEnumerable();
  }

  public async Task<PagedResult<Event>> GetAllEventsPaged(
    PagedCriteria pagination,
    CultureInfo cultureInfo)
  {
    IQueryable<Event> query = Set
        .Include(e => e.Location)
        .Include(e => e.Urls)
        .Include(e => e.Categories);

    var totalCount = await query.CountAsync();

    var results = await query
        .Skip((pagination.PageNumber - 1) * pagination.PageSize)
        .Take(pagination.PageSize)
        .ToListAsync();

    return new PagedResult<Event>(
        pagination,
        totalCount,
        results);
  }

  public async Task<PagedResult<Event>> GetAllEventsPaged(
    PagedCriteria pagination,
    CultureInfo cultureInfo,
    Guid userId)
  {
    IQueryable<Event> query = Set
        .Include(e => e.Location)
        .Include(e => e.Urls)
        .Include(e => e.Categories)
        .Where(e => e.CreatedBy == userId);

    var totalCount = await query.CountAsync();

    var results = await query
        .Skip((pagination.PageNumber - 1) * pagination.PageSize)
        .Take(pagination.PageSize)
        .ToListAsync();

    return new PagedResult<Event>(
        pagination,
        totalCount,
        results);
  }

  public async Task<PagedResult<Event>> GetAllEventsPaged(
    PagedCriteria pagination,
    EventFilterCriteria filter,
    CultureInfo cultureInfo)
  {
    var languageKey = cultureInfo.TwoLetterISOLanguageName;
    var orderByClause = "";

    // Start with base query
    IQueryable<Event> query = ModifiedSet
      .Include(e => e.Location)
      .Include(e => e.Urls)
      .Include(e => e.Categories)
      .AsNoTracking();

    // Date range filter
    if (filter.StartDateQuery.HasValue && filter.EndDateQuery.HasValue)
    {
      var startDate = filter.StartDateQuery.Value.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
      var endDate = filter.EndDateQuery.Value.ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);
      query = query.Where(w =>
        w.StartDate <= endDate && w.EndDate >= startDate);
    }

    // Apply category filter with LINQ
    if (filter.CategoryIdQuery.HasValue)
    {
      query = query.Where(e => e.Categories.Any(c => c.Id == filter.CategoryIdQuery.Value));
    }

    // For title searches that need JSON path, use custom SQL
    if (!string.IsNullOrWhiteSpace(filter.TitleQuery))
    {
      var parameters = new List<NpgsqlParameter>();
      var whereConditions = new List<string>();

      // Title filter
      if (!string.IsNullOrWhiteSpace(filter.TitleQuery))
      {
        parameters.Add(new NpgsqlParameter("titleQuery", $"%{filter.TitleQuery.ToLowerInvariant()}%"));

        whereConditions.Add($@"
          LOWER(
              jsonb_path_query_first(
                  ""e"".""Translations"",
                  CONCAT(
                      '$.',
                      CASE
                          WHEN jsonb_path_exists(""e"".""Translations"", '$.{languageKey}')
                          THEN '{languageKey}'
                          ELSE 'de'
                      END,
                      '.Title'
                  )::jsonpath
              )::text
          ) LIKE LOWER(@titleQuery)");
      }

      // Add WHERE clause if we have conditions
      var whereClause = whereConditions.Any()
        ? $" WHERE {string.Join(" AND ", whereConditions)}"
        : "";

      var sqlQuery = $@"
            SELECT e.""Id""
            FROM ""Guben"".""Event"" e
            LEFT JOIN ""Guben"".""Location"" l ON e.""LocationId"" = l.""Id""
            {whereClause}";

      // Get IDs of events that match the text search criteria
      var connection = Context.Database.GetDbConnection();
      await connection.OpenAsync();

      using var command = connection.CreateCommand();
      command.CommandText = sqlQuery;

      foreach (var parameter in parameters)
      {
        var p = command.CreateParameter();
        p.ParameterName = parameter.ParameterName;
        p.Value = parameter.Value;
        command.Parameters.Add(p);
      }

      var matchingIds = new List<Guid>();
      using (var reader = await command.ExecuteReaderAsync())
      {
        while (await reader.ReadAsync())
        {
          matchingIds.Add(reader.GetGuid(0));
        }
      }

      query = query.Where(e => matchingIds.Contains(e.Id));
    }

    var totalCount = await query.CountAsync();

    if (filter.SortBy.HasValue && filter.SortDirection.HasValue)
    {
      if (filter.SortBy.Value == EventSortOption.Title)
      {
        // We need to materialize the IDs first
        var ids = await query.Select(e => e.Id).ToListAsync();

        if (ids.Any())
        {
          // Then use those IDs with custom ordering SQL
          var sortDirection = GetSortDirection(filter.SortDirection.Value);
          var parameters = new List<NpgsqlParameter>();
          var idParams = new List<string>();

          for (var i = 0; i < ids.Count; i++)
          {
            var paramName = $"id{i}";
            parameters.Add(new NpgsqlParameter(paramName, ids[i]));
            idParams.Add($"@{paramName}");
          }

          var sqlQuery = $@"
                  SELECT e.*
                  FROM ""Guben"".""Event"" e
                  WHERE e.""Id"" IN ({string.Join(", ", idParams)})
                  ORDER BY (e.""Translations""->'{languageKey}'->>'Title') {sortDirection} NULLS LAST";

          var sortedEvents = await Set
            .FromSqlRaw(sqlQuery, parameters.ToArray())
            .Include(e => e.Location)
            .Include(e => e.Urls)
            .Include(e => e.Categories)
            .AsSplitQuery()
            .AsNoTracking()
            .Skip((pagination.PageNumber - 1) * pagination.PageSize)
            .Take(pagination.PageSize)
            .ToListAsync();

          return new PagedResult<Event>(
            pagination,
            totalCount,
            sortedEvents);
        }
      }
      else if (filter.SortBy.Value == EventSortOption.StartDate)
      {
        // Use LINQ for date sorting
        query = filter.SortDirection.Value == SortDirection.Ascending
          ? query.OrderBy(e => e.StartDate)
          : query.OrderByDescending(e => e.StartDate);
      }
    }

    var allEvents = await query.ToListAsync();

    if (filter.DistanceInKm.HasValue)
    {
      // Guben City Center, maybe make this configurabel...
      const double cityCenterLat = 51.95042;
      const double cityCenterLon = 14.7143;

      allEvents = allEvents.Where(e =>
      {
        if (e.Coordinates == null) return false;

        var distance = CalculateDistanceInKm(
          cityCenterLat,
          cityCenterLon,
          e.Coordinates.Latitude,
          e.Coordinates.Longitude
        );
        return distance <= filter.DistanceInKm.Value;
      }).ToList();
    }

    var filteredCount = allEvents.Count;

    // Apply pagination (if we haven't already returned for title sorting)
    var pagedItems = allEvents
      .Skip((pagination.PageNumber - 1) * pagination.PageSize)
      .Take(pagination.PageSize)
      .ToList();

    return new PagedResult<Event>(
      pagination,
      totalCount,
      pagedItems);
  }

  public static double CalculateDistanceInKm(double lat1, double lon1, double lat2, double lon2)
  {
    double R = 6371;
    double dLat = ToRadians(lat2 - lat1);
    double dLon = ToRadians(lon2 - lon1);

    double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
              Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
              Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

    double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
    return R * c;
  }

  private static double ToRadians(double angle)
  {
    return Math.PI * angle / 180.0;
  }

  private static string GetSortDirection(SortDirection direction) =>
    direction == SortDirection.Ascending ? "ASC" : "DESC";
}
