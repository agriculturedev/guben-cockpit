namespace Shared.Domain;

public class PagedResult<T>(PagedCriteria criteria, int totalCount, IEnumerable<T> results)
{
  public int PageNumber { get; } = criteria.PageNumber;
  public int PageSize { get; } = criteria.PageSize;
  public int TotalCount { get; } = totalCount;
  public int PageCount { get; } = (int)Math.Ceiling((double)totalCount / (double)criteria.PageSize);
  public IList<T> Results { get; } = results.ToList();
}
