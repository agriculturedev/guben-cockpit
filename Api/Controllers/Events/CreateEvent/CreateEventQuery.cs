using Shared.Api;

namespace Api.Controllers.Events.CreateEvent;

public class CreateEventQuery : IApiRequest<CreateEventResponse>
{
  public int Id { get; set; }
  public required string Title { get; set; }
  public required string Description { get; set; }
  public DateTime StartDate { get; set; }
  public DateTime EndDate { get; set; }

  public double Latitude { get; set; }
  public double Longitude { get; set; }

  public List<CreateUrlQuery> Urls { get; set; } = [];

  public List<Guid> CategoryIds { get; set; } = [];
  public Guid LocationId { get; set; }


}

public class CreateUrlQuery
{
  public string Link { get; set; }
  public string Description { get; set; }
}
