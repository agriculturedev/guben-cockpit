using Ardalis.SmartEnum;

namespace Domain.GeoDataSource;

public class GeoDataSourceType : SmartEnum<GeoDataSourceType>
{
  public static readonly GeoDataSourceType WFS = new GeoDataSourceType("WFS", 0);
  public static readonly GeoDataSourceType WMS = new GeoDataSourceType("WMS", 1);


  public GeoDataSourceType(string name, int value) : base(name, value) { }
}
