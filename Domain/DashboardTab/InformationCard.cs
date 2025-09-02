using System.Globalization;
using System.Text.Json.Serialization;
using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.DashboardTab;

public sealed class InformationCard : Entity<Guid>
{
  public Dictionary<string, DashboardCardI18NData> Translations { get; private set; } = new();

  public Button? Button { get; private set; }
  public string? ImageUrl { get; private set; }
  public int Sequenece { get; private set; }

  private InformationCard() { }

  private InformationCard(string? imageUrl, Button? button)
  {
    Id = Guid.CreateVersion7();
    ImageUrl = imageUrl;
    Button = button;
    Sequenece = 0;
  }

  public static Result<InformationCard> Create(string? title, string? description, string? imageUrl, string? imageAlt,
    Button? button, CultureInfo culture)
  {
    var dashboardCard = new InformationCard(imageUrl, button);

    var updateResult = dashboardCard.UpdateTranslation(title, description, imageAlt, culture);
    if (updateResult.IsFailure)
      return updateResult;

    return dashboardCard;
  }

  public Result UpdateTranslation(string? title, string? description, string? imageAlt, CultureInfo cultureInfo)
  {
    var (result, cardI18NData) = DashboardCardI18NData.Create(title, description, imageAlt);
    if (result.IsFailure)
      return result;

    Translations[cultureInfo.TwoLetterISOLanguageName] = cardI18NData;
    return Result.Ok();
  }

  public Result Update(string? title, string? description, string? imageUrl, string? imageAlt,
    CultureInfo culture)
  {
    ImageUrl = imageUrl;

    return UpdateTranslation(title, description, imageAlt, culture);
  }

  public void UpdateButton(Button? button)
  {
    Button = button;
  }

  public void UpdateSequence(int sequence)
  {
    Sequenece = sequence;
  }
}

public sealed class DashboardCardI18NData
{
  public string? Title { get; private set; }
  public string? Description { get; private set; }
  public string? ImageAlt { get; private set; }

  [JsonConstructor]
  private DashboardCardI18NData(string? title, string? description, string? imageAlt)
  {
    Title = title;
    Description = description;
    ImageAlt = imageAlt;
  }

  public static Result<DashboardCardI18NData> Create(string? title, string? description, string? imageAlt)
  {
    return new DashboardCardI18NData(title, description, imageAlt);
  }
}
