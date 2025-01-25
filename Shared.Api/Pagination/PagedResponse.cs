namespace Shared.Api.Pagination;

public abstract class PagedResponse<T>
{
  public required int PageNumber { get; init; }
  public required int PageSize { get; init; }
  public required int TotalCount { get; init; }
  public required int PageCount { get; init; }
  public required IEnumerable<T> Results { get; init; }
}
