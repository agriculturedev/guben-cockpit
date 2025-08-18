using System.ComponentModel;
using Ardalis.SmartEnum;

namespace Domain.GeoDataSource;

[TypeConverter(typeof(GeoDataSourceTypeConverter))]
public class GeoDataSourceType : SmartEnum<GeoDataSourceType>
{
  public static readonly GeoDataSourceType WFS = new GeoDataSourceType("WFS", 0);
  public static readonly GeoDataSourceType WMS = new GeoDataSourceType("WMS", 1);


  public GeoDataSourceType(string name, int value) : base(name, value) { }
}

public class GeoDataSourceTypeConverter : TypeConverter
{
    public override bool CanConvertFrom(ITypeDescriptorContext? context, Type sourceType)
        => sourceType == typeof(string) || base.CanConvertFrom(context, sourceType);

    public override object? ConvertFrom(ITypeDescriptorContext? context, System.Globalization.CultureInfo? culture, object value)
    {
        if (value is string s && GeoDataSourceType.TryFromName(s, true, out var enumValue))
            return enumValue;

        throw new FormatException($"Invalid GeoDataSourceType: {value}");
    }
}