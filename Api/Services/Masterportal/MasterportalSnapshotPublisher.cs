using System.Text.Json.Nodes;
using Domain.MasterportalLinks;
using Domain.MasterportalLinks.repository;

namespace Api.Services.Masterportal;

public class MasterportalSnapshotPublisher : IMasterportalSnapshotPublisher
{
    private readonly IMasterportalLinkRepository _masterportalLinkRepository;
    private readonly IMasterportalConfigWriter _masterportalConfigWriter;
    private readonly IMasterportalServicesWriter _masterportalServicesWriter;

    public MasterportalSnapshotPublisher(
        IMasterportalLinkRepository masterportalLinkRepository,
        IMasterportalConfigWriter masterportalConfigWriter,
        IMasterportalServicesWriter masterportalServicesWriter
    )
    {
        _masterportalLinkRepository = masterportalLinkRepository;
        _masterportalConfigWriter = masterportalConfigWriter;
        _masterportalServicesWriter = masterportalServicesWriter;
    }

    public async Task PublishAsync(CancellationToken cancellationToken = default)
    {
        var all = await _masterportalLinkRepository.GetAll() ?? new List<MasterportalLink>();

        var approved = all
            .Where(x => x.Status == MasterportalLinkStatus.Approved)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToList();

        var services = new JsonArray();
        foreach (var e in approved)
        {
            JsonObject? node = e.Type switch
            {
                MasterportalLinkType.WMS => BuildWmsNode(e),
                MasterportalLinkType.WFS => BuildWfsNode(e),
                _ => null
            };

            if (node is not null)
                services.Add(node);
        }

        await _masterportalServicesWriter.RewriteAsync(services, cancellationToken);

        var layerIds = approved.Select(x => x.Id.ToString());
        await _masterportalConfigWriter.WriteFreshAsync(layerIds, cancellationToken);
    }
    
    private static JsonObject BuildWmsNode(MasterportalLink e)
    {
        var typ              = "WMS";
        var url              = e.Url;
        var name             = e.Name;
        var format           = string.IsNullOrWhiteSpace(e.WmsFormat) ? "image/png" : e.WmsFormat!;
        var layers           = e.WmsLayers ?? "";
        var version          = string.IsNullOrWhiteSpace(e.WmsVersion) ? "1.3.0" : e.WmsVersion!;
        var gfiTheme         = string.IsNullOrWhiteSpace(e.WmsGfiTheme) ? "default" : e.WmsGfiTheme!;
        var maxScale         = string.IsNullOrWhiteSpace(e.WmsMaxScale) ? "2500000" : e.WmsMaxScale!;
        var minScale         = string.IsNullOrWhiteSpace(e.WmsMinScale) ? "0" : e.WmsMinScale!;
        var tileSize         = e.WmsTileSize ?? 512;
        var legendURL        = e.WmsLegendUrl ?? "";
        var visibility       = e.WmsVisibility ?? false;
        var transparent      = e.WmsTransparent ?? true;
        var featureCount     = string.IsNullOrWhiteSpace(e.WmsFeatureCount) ? "1" : e.WmsFeatureCount!;
        var transparency     = e.WmsTransparency ?? 0;
        var gfiAttributes    = string.IsNullOrWhiteSpace(e.WmsGfiAttributes) ? "ignore" : e.WmsGfiAttributes!;
        var layerAttribution = string.IsNullOrWhiteSpace(e.WmsLayerAttribution) ? "nicht vorhanden" : e.WmsLayerAttribution!;

        var supportedArr = new JsonArray();
        var supportedCsv = e.WmsSupported;
        if (!string.IsNullOrWhiteSpace(supportedCsv))
        {
            foreach (var part in supportedCsv.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
                supportedArr.Add(part);
        }
        else
        {
            supportedArr.Add("2D");
            supportedArr.Add("3D");
        }

        return new JsonObject
        {
            ["id"]               = e.Id.ToString(),
            ["typ"]              = typ,
            ["url"]              = url,
            ["name"]             = name,
            ["format"]           = format,
            ["layers"]           = layers,
            ["version"]          = version,
            ["gfiTheme"]         = gfiTheme,
            ["maxScale"]         = maxScale,
            ["minScale"]         = minScale,
            ["tilesize"]         = tileSize,
            ["legendURL"]        = legendURL,
            ["supported"]        = supportedArr,
            ["visibility"]       = visibility,
            ["transparent"]      = transparent,
            ["featureCount"]     = featureCount,
            ["transparency"]     = transparency,
            ["gfiAttributes"]    = gfiAttributes,
            ["layerAttribution"] = layerAttribution
        };
    }

    private static JsonObject? BuildWfsNode(MasterportalLink e)
    {
        if (string.IsNullOrWhiteSpace(e.WfsFeatureType))
            return null;

        var typ        = "WFS";
        var url        = e.Url;
        var name       = e.Name;
        var featureType= e.WfsFeatureType!;
        var featureNs  = string.IsNullOrWhiteSpace(e.WfsFeatureNs) ? "http://www.deegree.org/app" : e.WfsFeatureNs!;
        var version    = string.IsNullOrWhiteSpace(e.WfsVersion) ? "1.1.0" : e.WfsVersion!;

        return new JsonObject
        {
            ["id"]          = e.Id.ToString(),
            ["typ"]         = typ,
            ["url"]         = url,
            ["name"]        = name,
            ["featureType"] = featureType,
            ["featureNS"]   = featureNs,
            ["version"]     = version
        };
    }
}