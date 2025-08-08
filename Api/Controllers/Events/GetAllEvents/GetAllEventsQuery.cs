using Api.Controllers.Events.Shared;
using Api.Shared;
using Microsoft.AspNetCore.Mvc;
using Shared.Api;
using Shared.Api.Pagination;

namespace Api.Controllers.Events.GetAllEvents;

public class GetAllEventsQuery : PagedQuery, IApiRequest<GetAllEventsResponse>, IApiRequestWithCustomTransactions
{
  [FromQuery(Name = "title")]
  public string? TitleSearch { get; set; }

  [FromQuery(Name = "distance")]
  public int? DistanceInKm { get; set; }

  [FromQuery(Name = "category")]
  public Guid? CategoryId { get; set; }

  [FromQuery(Name = "startDate")]
  public DateOnly? StartDate { get; set; }

  [FromQuery(Name = "endDate")]
  public DateOnly? EndDate { get; set; }

  [FromQuery(Name = "sortBy")]
  public EventSortOption? SortBy { get; set; }

  [FromQuery(Name = "ordering")]
  public SortDirection? SortDirection { get; set; }
}
