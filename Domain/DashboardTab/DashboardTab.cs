using System.Collections.ObjectModel;
using System.Globalization;
using System.Text.Json.Serialization;
using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.DashboardTab;

public sealed class DashboardTab : Entity<Guid>
{
  public Dictionary<string, DashboardTabI18NData> Translations { get; private set; } = new();
  public int Sequence { get; private set; }
  public string MapUrl { get; private set; }
  public Guid? DropdownId { get; private set; }
  public Guid? EditorUserId { get; private set; }
  private readonly List<InformationCard> _informationCards = [];
  public IReadOnlyCollection<InformationCard> InformationCards => new ReadOnlyCollection<InformationCard>(_informationCards);

  private DashboardTab(int sequence, string mapUrl, Guid? dropdownId, Guid? editorUserId = null)
  {
    Id = Guid.CreateVersion7();
    Sequence = sequence;
    MapUrl = mapUrl;
    DropdownId = dropdownId;
    EditorUserId = editorUserId;
  }

  public static Result<DashboardTab> Create(
    string title,
    int sequence,
    string mapUrl,
    Guid? dropdownId,
    List<InformationCard> informationCards,
    CultureInfo cultureInfo,
    Guid? editorUserId = null
  )
  {
    var dashboardTab = new DashboardTab(sequence, mapUrl, dropdownId, editorUserId);
    dashboardTab.AddInformationCards(informationCards);

    var updateResult = dashboardTab.UpdateTranslation(title, cultureInfo);
    if (updateResult.IsFailure)
      return updateResult;

    return dashboardTab;
  }

  public Result Update(string title, string mapUrl, CultureInfo cultureInfo)
  {
    var updateTranslationResult = UpdateTranslation(title, cultureInfo);
    if (updateTranslationResult.IsFailure)
      return updateTranslationResult;

    MapUrl = mapUrl;

    return Result.Ok();
  }

  public Result UpdateTranslation(string title, CultureInfo cultureInfo)
  {
    var (result, pageI18NData) = DashboardTabI18NData.Create(title);
    if (result.IsFailure)
      return result;

    Translations[cultureInfo.TwoLetterISOLanguageName] = pageI18NData;
    return Result.Ok();
  }

  public void UpdateSequence(int sequence)
  {
    Sequence = sequence;
  }

  public void AssignToDropdown(Guid? dropdownId)
  {
    DropdownId = dropdownId;
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
  
  public Result AssignEditor(Guid editorUserId)
  {
    if (editorUserId == Guid.Empty)
      return Result.Error(TranslationKeys.UserNotFound);

    EditorUserId = editorUserId;
    return Result.Ok();
  }

  public void ClearEditor() => EditorUserId = null;
}

public sealed class DashboardTabI18NData
{
  public string Title { get; private set; }

  [JsonConstructor]
  private DashboardTabI18NData(string title)
  {
    Title = title;
  }

  public static Result<DashboardTabI18NData> Create(string title)
  {
    return new DashboardTabI18NData(title);
  }
}
