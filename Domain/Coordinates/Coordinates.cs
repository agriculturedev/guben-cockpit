using Shared.Domain.Validation;

namespace Domain.Coordinates;

public sealed class Coordinates : IEquatable<Coordinates>
{
  public double Latitude { get; private set; }
  public double Longitude { get; private set; }

  public Coordinates(double latitude, double longitude)
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

  public bool Equals(Coordinates? other)
  {
    if (other is null) return false;
    if (ReferenceEquals(this, other)) return true;
    return Latitude.Equals(other.Latitude) && Longitude.Equals(other.Longitude);
  }

  public override bool Equals(object? obj)
  {
    return ReferenceEquals(this, obj) || obj is Coordinates other && Equals(other);
  }

  public override int GetHashCode()
  {
    return HashCode.Combine(Latitude, Longitude);
  }
}
