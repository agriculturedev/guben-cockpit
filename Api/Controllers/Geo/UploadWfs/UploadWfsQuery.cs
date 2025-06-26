using Domain.GeoDataSource;
using Shared.Api;

namespace Api.Controllers.Geo.UploadWfs;

public class UploadWfsQuery : IApiRequest<UploadWfsResponse>
{
  public required bool IsPublic { get; set; }
  public required IFormFile File { get; set; }
  public required GeoDataSourceType Type { get; set; }
}
