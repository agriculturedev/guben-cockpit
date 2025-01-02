using Shared.Domain.Validation;

namespace Domain.Coordinates;

public sealed class Coordinates
{
  public double Latitude { get; private set; }
  public double Longitude { get; private set; }

  private Coordinates(double latitude, double longitude)
  {
    Latitude = latitude;
    Longitude = longitude;
  }

  public static Result<Coordinates> Create(double latitude, double longitude)
  {
    if (!CoordinateService.IsValidLatitude(latitude))
      return Result.Error(TranslationKeys.LatitudeOutOfBounds);

    if (!CoordinateService.IsValidLongitude(longitude))
      return Result.Error(TranslationKeys.LongitudeOutOfBounds);

    return new Coordinates(latitude, longitude);
  }
}
