using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.DashboardTab;

public sealed class InformationCard : Entity<Guid>
{
  public string? Title { get; private set; }
  public string? Description { get; private set; }
  public Button? Button { get; private set; }
  public string? ImageUrl { get; private set; }
  public string? ImageAlt { get; private set; }

  private InformationCard() { }

  private InformationCard(string? title, string? description, string? imageUrl, string? imageAlt, Button? button)
  {
    Id = Guid.CreateVersion7();
    Title = title;
    Description = description;
    ImageUrl = imageUrl;
    ImageAlt = imageAlt;
    Button = button;
  }

  public static Result<InformationCard> Create(string? title, string? description, string? imageUrl, string? imageAlt, Button? button)
  {
    return new InformationCard(title, description, imageUrl, imageAlt, button);
  }

  public void Update(string? title, string? description, string? imageUrl, string? imageAlt, Button? button)
  {
    Title = title;
    Description = description;
    ImageUrl = imageUrl;
    ImageAlt = imageAlt;
    Button = button;
  }

}
