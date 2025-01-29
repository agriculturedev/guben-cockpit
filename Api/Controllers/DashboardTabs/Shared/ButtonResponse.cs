using Domain.DashboardTab;

namespace Api.Controllers.DashboardTabs.Shared;

public class ButtonResponse
{
  public string Title { get; set; }
  public string Url { get; set; }
  public bool OpenInNewTab { get; set; }

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
