namespace Api.Infrastructure.Nextcloud;

public static class MimeHelper
{
  private static readonly Dictionary<string, string> MimeTypes = new(StringComparer.OrdinalIgnoreCase)
  {
    { ".txt", "text/plain" },
    { ".html", "text/html" },
    { ".htm", "text/html" },
    { ".css", "text/css" },
    { ".js", "application/javascript" },
    { ".json", "application/json" },
    { ".xml", "application/xml" },
    { ".jpg", "image/jpeg" },
    { ".jpeg", "image/jpeg" },
    { ".png", "image/png" },
    { ".gif", "image/gif" },
    { ".bmp", "image/bmp" },
    { ".webp", "image/webp" },
    { ".svg", "image/svg+xml" },
    { ".pdf", "application/pdf" },
    { ".zip", "application/zip" },
    { ".rar", "application/vnd.rar" },
    { ".tar", "application/x-tar" },
    { ".mp3", "audio/mpeg" },
    { ".mp4", "video/mp4" },
    { ".avi", "video/x-msvideo" },
    { ".mov", "video/quicktime" },
    { ".doc", "application/msword" },
    { ".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
    { ".xls", "application/vnd.ms-excel" },
    { ".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
    { ".ppt", "application/vnd.ms-powerpoint" },
    { ".pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation" }
  };

  public static string GetMimeTypeForFile(string filename)
  {
    if (string.IsNullOrWhiteSpace(filename))
      throw new ArgumentException("Filename must not be null or empty.", nameof(filename));

    var extension = Path.GetExtension(filename);
    if (string.IsNullOrEmpty(extension))
      return "application/octet-stream"; // Default binary type

    return MimeTypes.TryGetValue(extension, out var mimeType)
      ? mimeType
      : "application/octet-stream"; // Fallback if unknown
  }
}
