using System.Globalization;
using Domain.DashboardTab;

namespace Domain.Tests.DashboardTab;

public class DashboardTabBuilder
{
  private string _title = "Default Title";
  private int _sequence = 0;
  private string _mapUrl = "https://default.com";
  private List<InformationCard> _informationCards = new();
  private CultureInfo _culture = new CultureInfo("en-US");

  public DashboardTabBuilder WithTitle(string title)
  {
    _title = title;
    return this;
  }

  public DashboardTabBuilder WithSequence(int sequence)
  {
    _sequence = sequence;
    return this;
  }

  public DashboardTabBuilder WithMapUrl(string mapUrl)
  {
    _mapUrl = mapUrl;
    return this;
  }

  public DashboardTabBuilder WithCulture(CultureInfo culture)
  {
    _culture = culture;
    return this;
  }

  public DashboardTabBuilder WithInformationCards(List<InformationCard> informationCards)
  {
    _informationCards = informationCards;
    return this;
  }

  public Domain.DashboardTab.DashboardTab Build()
  {
    var (result, dashboardTab) = Domain.DashboardTab.DashboardTab.Create(_title, _sequence, _mapUrl, _informationCards, _culture);
    if (result.IsFailure)
      throw new ArgumentException(result.ToString());

    return dashboardTab;
  }
}
