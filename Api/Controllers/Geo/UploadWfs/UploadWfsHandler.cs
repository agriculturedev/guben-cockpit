using Api.Infrastructure.Extensions;
using Api.Infrastructure.Nextcloud;
using Domain.GeoDataSource;
using Domain.GeoDataSource.repository;
using Shared.Api;

namespace Api.Controllers.Geo.UploadWfs;

public class UploadWfsHandler : ApiRequestHandler<UploadWfsQuery, UploadWfsResponse>
{
  private readonly NextcloudManager _nextcloudManager;
  private readonly IGeoDataSourceRepository _geoDataSourceRepository;

  public UploadWfsHandler(NextcloudManager nextcloudManager, IGeoDataSourceRepository geoDataSourceRepository)
  {
    _nextcloudManager = nextcloudManager;
    _geoDataSourceRepository = geoDataSourceRepository;
  }

  public override async Task<UploadWfsResponse> Handle(UploadWfsQuery request, CancellationToken cancellationToken)
  {
    var extension = Path.GetExtension(request.File.FileName);

    using var ms = new MemoryStream();
    await request.File.CopyToAsync(ms, cancellationToken);

    var path = $"{NextcloudManager.WfsDirectory}/{request.File.FileName}.{extension}";
    await _nextcloudManager.CreateFileAsync(ms.ToArray(), path);

    var (result, newDataSource) = GeoDataSource.Create(path, false, request.IsPublic);
    result.ThrowIfFailure();

    await _geoDataSourceRepository.SaveAsync(newDataSource);

    return new UploadWfsResponse();
  }
}
