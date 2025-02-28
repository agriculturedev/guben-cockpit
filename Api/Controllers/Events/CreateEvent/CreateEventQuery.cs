using Api.Controllers.Events.Shared;
using Shared.Api;

namespace Api.Controllers.Events.CreateEvent;

// TODO: this will probably not be correct, was just to test out the creation of events. we will probably not be passing an EventId and TerminId from the frontend i suppose.
public class CreateEventQuery : IApiRequest<CreateEventResponse>
{
  public required string EventId { get; set; }
  public required string TerminId { get; set; }
  public required string Title { get; set; }
  public required string Description { get; set; }
  public DateTime StartDate { get; set; }
  public DateTime EndDate { get; set; }

  public double Latitude { get; set; }
  public double Longitude { get; set; }

  public required List<CreateUrlQuery> Urls { get; set; } = [];

  public required List<Guid> CategoryIds { get; set; } = [];
  public Guid LocationId { get; set; }
}
