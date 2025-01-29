namespace Api.Controllers.DashboardTabs.Shared;

public class AddCardQuery
{
  public required Guid TabId { get; set; }
  public string? Title { get; set; }
  public string? Description { get; set; }
  public UpsertButtonQuery? Button { get; set; }
  public string? ImageUrl { get; set; }
  public string? ImageAlt { get; set; }
}


public class UpdateCardQuery : AddCardQuery
{
  public required Guid CardId { get; set; }
}
