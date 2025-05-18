namespace Api.Controllers.Nextcloud.Shared;

public class FilesResponse
{
  public required string Filename { get; set; }
  public required string Url { get; set; }
  public required string ContentType { get; set; }
}
