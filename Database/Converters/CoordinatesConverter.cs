using System.Globalization;
using Domain.Coordinates;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Database.Converters;

public class CoordinatesConverter : ValueConverter<Coordinates?, string?>
{
  private const char Separator = ';';

  public CoordinatesConverter()
    : base(
      coordinates => ToDatabase(coordinates), // Conversion to string
      value => FromDatabase(value)
    ) { }

  public static string? ToDatabase(Coordinates? coordinates)
  {
    try
    {
      if (coordinates is null)
        return null;

      return $"{coordinates.Latitude}{Separator}{coordinates.Longitude}";
    }
    catch (Exception e)
    {
      Console.WriteLine(e);
      Console.WriteLine(coordinates);
      return null;
    }
  }

  public static Coordinates? FromDatabase(string? value)
  {
    try
    {
      if (value is null)
        return null;

      var parts = value.Split(Separator);
      var (coordsResult, coords) = Coordinates.Create(
        double.Parse(parts[0], CultureInfo.InvariantCulture),
        double.Parse(parts[1], CultureInfo.InvariantCulture)
      );

      if (coordsResult.IsFailure)
        throw new Exception("Failed to parse coordinates");

      return coords;
    }
    catch (Exception e)
    {
      Console.WriteLine(e);
      Console.WriteLine(value);
      return null;
    }
  }
}
