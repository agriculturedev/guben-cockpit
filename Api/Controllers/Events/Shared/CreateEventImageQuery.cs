namespace Api.Controllers.Events.Shared;

public struct CreateEventImageQuery
{
  public required string ThumbnailUrl { get; set; }
  public required string PreviewUrl { get; set; }
  public required string OriginalUrl { get; set; }
}
