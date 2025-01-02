namespace Shared.Domain;

public class PagedCriteria(int pageNumber, int pageSize)
{
  public int PageNumber { get; } = pageNumber;
  public int PageSize { get; } = pageSize;
}
