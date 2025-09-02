using System.Text;
using System.Text.Json.Nodes;
using Api.Infrastructure.Nextcloud;
using Api.Services.Masterportal;
using Domain;
using Domain.GeoDataSource.repository;
using Shared.Api;

namespace Api.Controllers.Geo.ValidateGeoDataSource;

public class ValidateGeoDataSourceHandler : ApiRequestHandler<ValidateGeoDataSourceQuery, ValidateGeoDataSourceResponse>
{
  private readonly IGeoDataSourceRepository _geoDataSourceRepository;
  private readonly IMasterportalServicesWriter _mpWriter;
  private readonly NextcloudManager _nextcloud;
  private readonly IMasterportalConfigWriter _mpConfig;

  public ValidateGeoDataSourceHandler(
    IGeoDataSourceRepository geoDataSourceRepository,
    IMasterportalServicesWriter mpWriter,
    NextcloudManager nextcloud,
    IMasterportalConfigWriter mpConfig
  )
  {
    _geoDataSourceRepository = geoDataSourceRepository;
    _mpWriter = mpWriter;
    _nextcloud = nextcloud;
    _mpConfig   = mpConfig;
  }

  public override async Task<ValidateGeoDataSourceResponse> Handle(ValidateGeoDataSourceQuery request, CancellationToken cancellationToken)
  {
    var source = await _geoDataSourceRepository.Get(request.Id);

    if (source is null)
      throw new ProblemDetailsException(TranslationKeys.GeoDataSourceNotFound);

    if (request.IsValid)
      source.Validate();
    else
      source.Invalidate();

    await _geoDataSourceRepository.SaveAsync(source);

    if (source.IsPublic && source.IsValidated)
    {
      if (string.IsNullOrWhiteSpace(source.Path))
        throw new ProblemDetailsException("GeoDataSource.Path is empty; cannot fetch config from Nextcloud.");

      await AppendLayerFromNextcloudAsync(source.Path, cancellationToken);
    }

    return new ValidateGeoDataSourceResponse();
  }

  private async Task AppendLayerFromNextcloudAsync(string nextcloudPath, CancellationToken ct)
  {
    var bytes = await _nextcloud.GetFileAsync(nextcloudPath);
    if (bytes == null || bytes.Length == 0)
      throw new ProblemDetailsException($"Nextcloud file at '{nextcloudPath}' is empty.");

    JsonNode? node;
    try
    {
      var jsonText = Encoding.UTF8.GetString(bytes);
      node = JsonNode.Parse(jsonText);
    }
    catch (Exception ex)
    {
      throw new ProblemDetailsException($"Invalid JSON in Nextcloud file '{nextcloudPath}': {ex.Message}");
    }

    var ids = new List<string>();

    if (node is JsonArray arr)
    {
      foreach (var item in arr)
      {
        if (item == null) continue;
        await _mpWriter.AppendAsync(item, ct);

        if (item is JsonObject jo && jo.TryGetPropertyValue("id", out var idNode))
        {
          var id = idNode?.GetValue<string>();
          if (!string.IsNullOrWhiteSpace(id))
            ids.Add(id!);
        }
      }
    }
    else
    {
      await _mpWriter.AppendAsync(node!, ct);
      if (node is JsonObject jo && jo.TryGetPropertyValue("id", out var idNode))
      {
        var id = idNode?.GetValue<string>();
        if (!string.IsNullOrWhiteSpace(id))
          ids.Add(id!);
      }
    }

    foreach (var id in ids.Distinct(StringComparer.OrdinalIgnoreCase))
    {
      await _mpConfig.EnsureFolderAndAddLayerAsync(id, ct);
    }
  }
}
