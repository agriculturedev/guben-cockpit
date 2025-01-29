using Domain.DashboardTab;

namespace Api.Controllers.DashboardTabs.Shared;

public class DashboardTabResponse
{
  public required Guid Id { get; set; }
  public required string Title { get; set; }
  public required int Sequence { get; set; }
  public required string MapUrl { get; set; }
  public IEnumerable<InformationCardResponse> InformationCards { get; set; }

  public static DashboardTabResponse Map(DashboardTab dashboardTab)
  {
    return new DashboardTabResponse()
    {
      Id = dashboardTab.Id,
      Title = dashboardTab.Title,
      Sequence = dashboardTab.Sequence,
      MapUrl = dashboardTab.MapUrl,
      InformationCards = dashboardTab.InformationCards.Select(InformationCardResponse.Map).ToList(),
    };
  }
}
