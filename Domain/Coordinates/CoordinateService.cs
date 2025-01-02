namespace Domain.Coordinates;

public sealed class CoordinateService
{
  /// <summary>
  /// Validates latitude and longitude coordinates.
  /// </summary>
  /// <param name="latitude">Latitude as a double.</param>
  /// <param name="longitude">Longitude as a double.</param>
  /// <returns>True if the coordinates are valid; otherwise, false.</returns>
  public static bool ValidateCoordinates(double latitude, double longitude)
  {
    return IsValidLatitude(latitude) && IsValidLongitude(longitude);
  }

  /// <summary>
  /// Checks if the latitude is within the valid range of -90 to 90.
  /// </summary>
  public static bool IsValidLatitude(double latitude)
  {
    return latitude is >= -90 and <= 90;
  }

  /// <summary>
  /// Checks if the longitude is within the valid range of -180 to 180.
  /// </summary>
  public static bool IsValidLongitude(double longitude)
  {
    return longitude is >= -180 and <= 180;
  }
}
