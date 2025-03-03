using Domain.DashboardTab;

namespace Api.Controllers.DashboardTabs.Shared;

public struct InformationCardResponse
{
  public required Guid Id { get;  set; }
  public string? Title { get;  set; }
  public string? Description { get;  set; }
  public ButtonResponse? Button { get;  set; }
  public string? ImageUrl { get;  set; }
  public string? ImageAlt { get;  set; }

  public static InformationCardResponse Map(InformationCard informationCard)
  {
    return new InformationCardResponse()
    {
      Id = informationCard.Id,
      Title = informationCard.Title,
      Description = informationCard.Description,
      ImageUrl = informationCard.ImageUrl,
      ImageAlt = informationCard.ImageAlt,
      Button = informationCard.Button is not null ? ButtonResponse.Map(informationCard.Button) : null,
    };
  }
}
