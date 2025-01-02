using Domain.Coordinates;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Database.Converters;

public class CoordinatesConverter : ValueConverter<Coordinates?, string?>
{
  public CoordinatesConverter()
    : base(
      coordinates => ToDatabase(coordinates), // Conversion to string
      value => FromDatabase(value)
      ) { }

  public static string? ToDatabase(Coordinates? coordinates)
  {
    if (coordinates is null)
      return null;

    return $"{coordinates.Latitude},{coordinates.Longitude}";
  }

  public static Coordinates? FromDatabase(string? value)
  {
    if (value is null)
      return null;

    var parts = value.Split(',');
    var (coordsResult, coords) = Coordinates.Create(
      double.Parse(parts[0]),
      double.Parse(parts[1])
    );

    if (coordsResult.IsFailure)
      throw new Exception("Failed to parse coordinates");

    return coords;
  }
}
