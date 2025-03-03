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

  public Task<Event?> GetByEventIdAndTerminIdIncludingUnpublished(string eventId, string terminId)
  {
    return Set
      .AsSplitQuery()
      .TagWith(nameof(EventRepository) + "." + nameof(GetByEventIdAndTerminIdIncludingUnpublished))
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

    // For title and location searches that need JSON path, use custom SQL
    if (!string.IsNullOrWhiteSpace(filter.TitleQuery) ||
        filter.LocationQuery?.Length > 0)
    {
      var parameters = new List<NpgsqlParameter>();
      var whereConditions = new List<string>();

      // Title filter
      if (!string.IsNullOrWhiteSpace(filter.TitleQuery))
      {
        parameters.Add(new NpgsqlParameter("titleQuery", $"%{filter.TitleQuery.ToLowerInvariant()}%"));

        // TODO: this entire sql statement is very similar to other locations, extract it later
        whereConditions.Add($@"
          LOWER(
              jsonb_path_query_first(
                  e.""Translations"",
                  CONCAT(
                      '$.',
                      CASE
                          WHEN jsonb_path_exists(e.""Translations"", '$.{languageKey}')
                          THEN '{languageKey}'
                          ELSE 'de'
                      END,
                      '.Title'
                  )
              )::text
          ) LIKE LOWER(@titleQuery)");
      }

      // Location filter
      if (filter.LocationQuery?.Length > 0)
      {
        var locationConditions = new List<string>();
        for (var i = 0; i < filter.LocationQuery.Length; i++)
        {
          var paramName = $"location{i}";
          parameters.Add(new NpgsqlParameter(paramName, $"%{filter.LocationQuery[i].ToLowerInvariant()}%"));

          locationConditions.Add($@"
                    LOWER(jsonb_path_query_first(
                        l.""Translations"",
                        'CONCAT(
                          '$.',
                          CASE
                              WHEN jsonb_path_exists(e.""Translations"", '$.{languageKey}')
                              THEN '{languageKey}'
                              ELSE 'de'
                          END,
                          '.Name'
                      )
                    )::text) LIKE @{paramName}
                    OR LOWER(l.""City"") LIKE @{paramName}");
        }

        whereConditions.Add($"({string.Join(" OR ", locationConditions)})");
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

    // Apply pagination (if we haven't already returned for title sorting)
    var pagedItems = await query
      .Skip((pagination.PageNumber - 1) * pagination.PageSize)
      .Take(pagination.PageSize)
      .ToListAsync();

    return new PagedResult<Event>(
      pagination,
      totalCount,
      pagedItems);


  }

  private static string GetSortDirection(SortDirection direction) =>
    direction == SortDirection.Ascending ? "ASC" : "DESC";
}
