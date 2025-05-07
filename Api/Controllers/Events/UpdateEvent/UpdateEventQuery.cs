using Api.Controllers.Events.Shared;
using Shared.Api;

namespace Api.Controllers.Events.UpdateEvent;

public class UpdateEventQuery : IApiRequest<UpdateEventResponse>
{
  public required Guid Id { get; set; }
  public required string Title { get; set; }
  public required string Description { get; set; }
  public DateTime StartDate { get; set; }
  public DateTime EndDate { get; set; }

  public double Latitude { get; set; }
  public double Longitude { get; set; }

  public required List<CreateUrlQuery> Urls { get; set; } = [];

  public required List<Guid> CategoryIds { get; set; } = [];
  public required List<CreateEventImageQuery> Images {get; set;} = [];
  public Guid LocationId { get; set; }
}
