namespace Api.Controllers.DashboardTabs.Shared;

public class UpsertButtonQuery
{
  public required string Title { get; set; }
  public required string Url { get; set; }
  public required bool OpenInNewTab { get; set; }
}
