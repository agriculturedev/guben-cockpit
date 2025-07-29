using Domain.GeoDataSource;

namespace Api.Controllers.Geo.Shared;

public class GeoDataSourceResponse
{
  public required string Path { get; set; }
  public required bool IsValidated { get; set; }
  public required bool IsPublic { get; set; }

  public required int Type { get; set; }

  public static GeoDataSourceResponse Map(GeoDataSource dataSource)
  {
    return new GeoDataSourceResponse()
    {
      Path = dataSource.Path,
      IsValidated = dataSource.IsValidated,
      IsPublic = dataSource.IsPublic,
      Type = dataSource.Type.Value
    };
  }
}
