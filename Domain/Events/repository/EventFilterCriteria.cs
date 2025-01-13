namespace Domain.Events.repository;

public class EventFilterCriteria
{
  public string? TitleQuery { get; set; }
  public string? LocationQuery { get; set; }
  public Guid? CategoryIdQuery { get; set; }

  public DateOnly? StartDateQuery { get; set; }
  public DateOnly? EndDateQuery { get; set; }

  public EventSortOption? SortBy { get; set; }
  public SortDirection? SortDirection { get; set; }
}
