using System.ComponentModel;
using Shared.Domain;

namespace Shared.Api.Pagination;

public abstract class PagedQuery
{
  public const int DefaultPageNumber = 1;
  public const int DefaultPageSize = 2;

  [DefaultValue(DefaultPageNumber)]
  public int PageNumber { get; init; } = DefaultPageNumber;
  [DefaultValue(DefaultPageSize)]
  public int PageSize { get; init; } = DefaultPageSize;

  public static implicit operator PagedCriteria(PagedQuery query)
  {
    return new PagedCriteria(query.PageNumber, query.PageSize);
  }
}
