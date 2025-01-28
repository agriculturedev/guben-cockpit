using System.Collections.ObjectModel;
using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.DashboardTab;

public sealed class DashboardTab : Entity<Guid>
{
  public string Title { get; private set; }
  public int Sequence { get; private set; }
  public string MapUrl { get; private set; }
  private readonly List<InformationCard> _informationCards = [];
  public IReadOnlyCollection<InformationCard> InformationCards => new ReadOnlyCollection<InformationCard>(_informationCards);

  private DashboardTab(string title, int sequence, string mapUrl)
  {
    Id = Guid.CreateVersion7();
    Title = title;
    Sequence = sequence;
    MapUrl = mapUrl;
  }

  public static Result<DashboardTab> Create(string title, int sequence, string mapUrl, List<InformationCard> informationCards)
  {
    var dashboardTab = new DashboardTab(title, sequence, mapUrl);
    dashboardTab.AddInformationCards(informationCards);

    return dashboardTab;
  }

  public void AddInformationCards(List<InformationCard> informationCards)
  {
    foreach (var informationCard in informationCards)
    {
      AddInformationCard(informationCard);
    }
  }

  public void AddInformationCard(InformationCard informationCard)
  {
    _informationCards.Add(informationCard);
  }

  public Result DeleteInformationCard(Guid informationCardid)
  {
    var infoCard = _informationCards.FirstOrDefault(a => a.Id == informationCardid);
    if (infoCard is null)
      return Result.Error(TranslationKeys.InformationCardNotFound);

    _informationCards.Remove(infoCard);
    return Result.Ok();
  }
}
