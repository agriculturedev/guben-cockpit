using Api.Controllers.Categories.Shared;
using Api.Controllers.Locations.Shared;
using Domain.Coordinates;
using Domain.Events;
using Domain.Urls;

namespace Api.Controllers.Events.Shared;

public struct EventResponse
{
  public required Guid Id { get; set; }
  public required string EventId { get; set; }
  public required string TerminId { get; set; }
  public required string Title { get; set; }
  public required string Description { get; set; }
  public required DateTime StartDate { get; set; }
  public required DateTime EndDate { get; set; }
  public required LocationResponse Location { get; set; }
  public CoordinatesResponse? Coordinates { get; set; }
  public required IEnumerable<UrlResponse> Urls { get; set; }
  public required IEnumerable<CategoryResponse> Categories { get; set; }

  public static EventResponse Map(Event @event)
  {
    return new EventResponse()
    {
      Id = @event.Id,
      EventId = @event.EventId,
      TerminId = @event.TerminId,
      Title = @event.Title,
      Description = @event.Description,
      StartDate = @event.StartDate,
      EndDate = @event.EndDate,
      Location = LocationResponse.Map(@event.Location),
      Coordinates = @event.Coordinates is not null ? CoordinatesResponse.Map(@event.Coordinates) : null,
      Urls = @event.Urls.Select(UrlResponse.Map),
      Categories = @event.Categories.Select(CategoryResponse.Map)
    };
  }
}

public class CoordinatesResponse
{
  public double Latitude { get; set; }
  public double Longitude { get; set; }

  public static CoordinatesResponse Map(Coordinates coordinates)
  {
    return new CoordinatesResponse()
    {
      Latitude = coordinates.Latitude,
      Longitude = coordinates.Longitude
    };
  }
}

public class UrlResponse
{
  public required string Link { get; set; }
  public required string Description { get; set; }

  public static UrlResponse Map(Url url)
  {
    return new UrlResponse()
    {
      Link = url.Link,
      Description = url.Description
    };
  }
}

