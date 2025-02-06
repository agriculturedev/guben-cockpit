using Domain.DashboardTab;

namespace Api.Controllers.DashboardTabs.Shared;

public struct ButtonResponse
{
  public required string Title { get; set; }
  public required string Url { get; set; }
  public required bool OpenInNewTab { get; set; }

  public static ButtonResponse Map(Button button)
  {
    return new ButtonResponse()
    {
      Title = button.Title,
      Url = button.Url,
      OpenInNewTab = button.OpenInNewTab
    };
  }
}
