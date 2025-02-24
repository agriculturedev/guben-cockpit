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
        .TagWith(nameof(EventRepository) + "." + nameof(GetByEventIdAndTerminId))
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
      // TODO@JOREN: published only?
        var languageKey = cultureInfo.TwoLetterISOLanguageName;
        var parameters = new List<NpgsqlParameter>();
        var whereConditions = new List<string>();
        var orderByClause = "";

        // Base query for both count and data
        var baseQuery = $@"
            FROM ""Guben"".""Event"" e
            LEFT JOIN ""Guben"".""Location"" l ON e.""LocationId"" = l.""Id""";

        // Title filter
        if (!string.IsNullOrWhiteSpace(filter.TitleQuery))
        {
            parameters.Add(new NpgsqlParameter("titleQuery", $"%{filter.TitleQuery.ToLower()}%"));
            whereConditions.Add($@"
                LOWER(jsonb_path_query_first(
                    e.""Translations"",
                    '$.{languageKey}.Title'
                )::text) LIKE @titleQuery");
        }

        // Category filter
        if (filter.CategoryIdQuery.HasValue)
        {
            parameters.Add(new NpgsqlParameter("categoryId", filter.CategoryIdQuery.Value));
            baseQuery += @"
                INNER JOIN ""Guben"".""EventCategory"" ec ON e.""Id"" = ec.""EventsId""
                WHERE ec.""CategoriesId"" = @categoryId";
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
                        '$.{languageKey}.Name'
                    )::text) LIKE @{paramName}
                    OR LOWER(l.""City"") LIKE @{paramName}");
            }
            whereConditions.Add($"({string.Join(" OR ", locationConditions)})");
        }

        // Add WHERE clause if we have conditions
        var whereClause = whereConditions.Any()
            ? $" WHERE {string.Join(" AND ", whereConditions)}"
            : "";

        // TODO@JOREN: test when sorting on frontend is fixed

        // // Sorting
        // if (filter.SortBy.HasValue && filter.SortDirection.HasValue)
        // {
        //     orderByClause = filter.SortBy switch
        //     {
        //         EventSortOption.Title => $@"
        //             jsonb_path_query_first(
        //                 e.""Translations"",
        //                 '$.{languageKey}.Title'
        //             )::text {GetSortDirection(filter.SortDirection.Value)}",
        //         EventSortOption.StartDate => $@"e.""StartDate"" {GetSortDirection(filter.SortDirection.Value)}",
        //         _ => ""
        //     };
        // }
        //
        // // Construct final data query
        // var sql = $@"
        //     SELECT e.*
        //     {baseQuery}
        //     {whereClause}
        //     {(!string.IsNullOrEmpty(orderByClause) ? $" ORDER BY {orderByClause}" : "")}
        //     LIMIT @pageSize OFFSET @offset";
        // Build ORDER BY clause
        if (filter.SortBy.HasValue && filter.SortDirection.HasValue)
        {
          var sortDirection = GetSortDirection(filter.SortDirection.Value);
          orderByClause = filter.SortBy switch
          {
            EventSortOption.Title => $@"
                    ORDER BY (e.""Translations""->'{languageKey}'->>'Title') {sortDirection} NULLS LAST",
            EventSortOption.StartDate => $@"ORDER BY e.""StartDate"" {sortDirection}",
            _ => ""
          };
        }

        // Construct final data query
        var sql = $@"
            SELECT e.*
            {baseQuery}
            {whereClause}
            {orderByClause}
            LIMIT @pageSize OFFSET @offset";

        parameters.Add(new NpgsqlParameter("pageSize", pagination.PageSize));
        parameters.Add(new NpgsqlParameter("offset", (pagination.PageNumber - 1) * pagination.PageSize));

        // Execute data query
        var eventsQuery = Set
          .FromSqlRaw(sql, parameters.ToArray())
          .Include(e => e.Location)
          .Include(e => e.Urls)
          .Include(e => e.Categories)
          .AsSplitQuery()
          .AsNoTracking();
            // .ToListAsync();

        // Date range filter
        if (filter.StartDateQuery.HasValue && filter.EndDateQuery.HasValue)
        {
          var startDate = filter.StartDateQuery.Value.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
          var endDate = filter.EndDateQuery.Value.ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);
          eventsQuery = eventsQuery.Where(w =>
            w.StartDate <= endDate && w.EndDate >= startDate);

          // var startDate = filter.StartDateQuery.Value.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
          // var endDate = filter.EndDateQuery.Value.ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);
          //
          // parameters.Add(new NpgsqlParameter("startDate", NpgsqlDbType.Date) { Value = startDate });
          // parameters.Add(new NpgsqlParameter("endDate", NpgsqlDbType.Date) { Value = endDate });
          //
          // whereConditions.Add(@"e.""StartDate"" <= @endDate AND e.""EndDate"" >= @startDate");
        }

        var events = await eventsQuery.ToListAsync();

        // Execute count query
        var countQuery = $@"
            SELECT COUNT(DISTINCT e.""Id"")
            {baseQuery}
            {whereClause}";

        var connection = Context.Database.GetDbConnection();
        await connection.OpenAsync();

        using var command = connection.CreateCommand();
        command.CommandText = countQuery;

        foreach (var parameter in parameters.Where(p => p.ParameterName != "pageSize" && p.ParameterName != "offset"))
        {
            var p = command.CreateParameter();
            p.ParameterName = parameter.ParameterName;
            p.Value = parameter.Value;
            command.Parameters.Add(p);
        }

        var totalCount = Convert.ToInt32(await command.ExecuteScalarAsync());

        return new PagedResult<Event>(
          pagination,
          totalCount,
          events);
    }

    private static string GetSortDirection(SortDirection direction) =>
        direction == SortDirection.Ascending ? "ASC" : "DESC";

    // public IEnumerable<Event> GetAllEvents()
    // {
    //     return Set
    //         .FromSqlRaw(@"
    //             SELECT e.*
    //             FROM ""Guben"".""Event"" e
    //             LEFT JOIN ""Guben"".""Location"" l ON e.""LocationId"" = l.""Id""")
    //         .Include(e => e.Location)
    //         .Include(e => e.Urls)
    //         .Include(e => e.Categories)
    //         .AsNoTracking()
    //         .AsSplitQuery()
    //         .AsEnumerable();
    // }
//   public Task<Event?> GetByEventIdAndTerminId(string eventId, string terminId)
//   {
//     return Set
//       .Include(e => e.Location)
//       .Include(e => e.Urls)
//       .Include(e => e.Categories)
//       .FirstOrDefaultAsync(e => e.EventId == eventId && e.TerminId == terminId);
//   }
//
//   public IEnumerable<Event> GetAllEvents()
//   {
//     return Set
//       .AsNoTracking()
//       .AsSplitQuery()
//       .TagWith(nameof(EventRepository) + "." + nameof(GetAllEvents))
//       .Include(e => e.Location)
//       .Include(e => e.Urls)
//       .Include(e => e.Categories)
//       .AsEnumerable();
//   }
//
//   public Task<PagedResult<Event>> GetAllEventsPaged(PagedCriteria pagination, EventFilterCriteria filter, CultureInfo cultureInfo)
//   {
//     return Set
//       .AsNoTracking()
//       .AsSplitQuery()
//       .TagWith(nameof(EventRepository) + "." + nameof(GetAllEvents))
//       .Include(e => e.Location)
//       .Include(e => e.Urls)
//       .Include(e => e.Categories)
//       .ApplyGetAllFilters(filter, cultureInfo)
//       .ApplySorting(filter, cultureInfo)
//       .ToPagedResult(pagination);
//   }
// }
//
// internal static class EventRepositoryExtensions
// {
//   internal static IQueryable<Event> ApplyGetAllFilters(this IQueryable<Event> query, EventFilterCriteria filter,
//     CultureInfo cultureInfo)
//   {
//     if (!string.IsNullOrWhiteSpace(filter.TitleQuery))
//       query = query.Where(w => EF.Functions.Like(w.Translations[cultureInfo.TwoLetterISOLanguageName].Title.ToLower(),
//         "%" + filter.TitleQuery.ToLower() + "%"));
//
//     if (filter.StartDateQuery.HasValue && filter.EndDateQuery.HasValue)
//     {
//       var startDate = filter.StartDateQuery.Value.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
//       var endDate = filter.EndDateQuery.Value.ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);
//       query = query.Where(w =>
//         w.StartDate <= endDate && w.EndDate >= startDate); // any overlap will result in the item being returned
//     }
//
//     if (filter.CategoryIdQuery.HasValue)
//       query = query.Where(w => w.Categories.Any(cat => cat.Id == filter.CategoryIdQuery.Value));
//
//     if (filter.LocationQuery?.Length > 0)
//       query = query.Where(w =>
//         filter.LocationQuery.Any(l =>
//           EF.Functions.Like(w.Location.Translations[cultureInfo.TwoLetterISOLanguageName].Name, "%" + l + "%")
//           || (w.Location.City != null
//               && EF.Functions.Like(w.Location.City, "%" + l + "%"))));
//
//     return query;
//   }
//
//   internal static IQueryable<Event> ApplySorting(this IQueryable<Event> query, EventFilterCriteria filter,
//     CultureInfo cultureInfo)
//   {
//     if (!filter.SortBy.HasValue || !filter.SortDirection.HasValue)
//       return query;
//
//     switch (filter.SortBy)
//     {
//       case EventSortOption.Title:
//         switch (filter.SortDirection)
//         {
//           case SortDirection.Ascending:
//             query = query.OrderBy(w => w.Translations[cultureInfo.TwoLetterISOLanguageName].Title);
//             break;
//           case SortDirection.Descending:
//             query = query.OrderByDescending(w => w.Translations[cultureInfo.TwoLetterISOLanguageName].Title);
//             break;
//         }
//
//         break;
//
//       case EventSortOption.StartDate:
//         switch (filter.SortDirection)
//         {
//           case SortDirection.Ascending:
//             query = query.OrderBy(w => w.StartDate);
//             break;
//           case SortDirection.Descending:
//             query = query.OrderByDescending(w => w.StartDate);
//             break;
//         }
//
//         break;
//     }
//
//     return query;
//   }
}
