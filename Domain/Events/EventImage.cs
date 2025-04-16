using Shared.Domain.Validation;

namespace Domain.Events;

public class EventImage
{
  public string ThumbnailUrl { get; private set; }
  public string PreviewUrl { get; private set; }
  public string OriginalUrl { get; private set; }
  public int? Width { get; private set; }
  public int? Height { get; private set; }

  public EventImage(string thumbnail, string preview, string original, (int width, int height)? dimensions)
  {
    ThumbnailUrl = thumbnail;
    PreviewUrl = preview;
    OriginalUrl = original;
    Width = dimensions?.width;
    Height = dimensions?.height;
  }

  public static Result<EventImage> Create(
    string? thumbnail,
    string? preview,
    string? original,
    string? width,
    string? height
  )
  {
    if (string.IsNullOrEmpty(thumbnail)) return Result.Error(TranslationKeys.MissingThumbnail);
    if (string.IsNullOrEmpty(preview)) return Result.Error(TranslationKeys.MissingPreviewImage);
    if (string.IsNullOrEmpty(original)) return Result.Error(TranslationKeys.MissingOriginalImage);

    if (!int.TryParse(width ?? "", out var imWidth) ||
        !int.TryParse(height, out var imHeight)
      ) return new EventImage(thumbnail, preview, original, null);

    return new EventImage(thumbnail, preview, original, (imWidth, imHeight));
  }
}
