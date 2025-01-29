using Domain.DashboardTab;

namespace Api.Controllers.DashboardTabs.Shared;

public class DashboardTabResponse
{
  public required string Title { get; set; }
  public required int Sequence { get; set; }
  public required string MapUrl { get; set; }
  public IEnumerable<InformationCardResponse> InformationCards { get; set; }

  public static DashboardTabResponse Map(DashboardTab dashboardTab)
  {
    return new DashboardTabResponse()
    {
      Title = dashboardTab.Title,
      Sequence = dashboardTab.Sequence,
      MapUrl = dashboardTab.MapUrl,
      InformationCards = dashboardTab.InformationCards.Select(InformationCardResponse.Map).ToList(),
    };
  }
}
