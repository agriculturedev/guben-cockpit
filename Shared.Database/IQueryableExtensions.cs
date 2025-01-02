using Microsoft.EntityFrameworkCore;
using Shared.Domain;

namespace Shared.Database;

public static class IQueryableExtensions
{
  public static async Task<PagedResult<T>> ToPagedResult<T>(this IQueryable<T> query, PagedCriteria paging)
  {
    var totalCount = await query.CountAsync();
    var values = await query
      .Skip((paging.PageNumber - 1) * paging.PageSize)
      .Take(paging.PageSize)
      .ToListAsync();
    return new PagedResult<T>(paging, totalCount, values);
  }
}
