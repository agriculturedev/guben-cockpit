using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.MasterportalLinks
{
    public enum MasterportalLinkType
    {
        Unknown = 0,
        WMS = 1,
        WFS = 2
    }

    public enum MasterportalLinkStatus
    {
        Pending = 0,
        Approved = 1,
        Rejected = 2
    }

    public class MasterportalLink : Entity<Guid>
    {
        // identity
        public DateTime CreatedAtUtc { get; private set; } = DateTime.UtcNow;
        public string? CreatedByUserId { get; private set; }
        public DateTime? UpdatedAtUtc { get; private set; }
        public string? UpdatedByUserId { get; private set; }

        // workflow
        public MasterportalLinkStatus Status { get; private set; } = MasterportalLinkStatus.Pending;
        public string? ReviewNote { get; private set; }

        // wfs / wms
        public string Name { get; private set; }
        public string Url { get; private set; }
        public string Folder { get; private set; }
        public MasterportalLinkType Type { get; private set; } = MasterportalLinkType.Unknown;

        // wms specific
        public string? WmsLayers { get; private set; }
        public string? WmsFormat { get; private set; }
        public string? WmsVersion { get; private set; }
        public string? WmsGfiTheme { get; private set; }
        public string? WmsMaxScale { get; private set; }
        public string? WmsMinScale { get; private set; }
        public int? WmsTileSize { get; private set; }
        public string? WmsLegendUrl { get; private set; }
        public string? WmsSupported { get; private set; }
        public bool? WmsVisibility { get; private set; }
        public bool? WmsTransparent { get; private set; }
        public string? WmsFeatureCount { get; private set; }
        public int? WmsTransparency { get; private set; }
        public string? WmsGfiAttributes { get; private set; }
        public string? WmsLayerAttribution { get; private set; }

        // wfs specific
        public string? WfsFeatureType { get; private set; }
        public string? WfsFeatureNs { get; private set; }
        public string? WfsVersion { get; private set; }

        private MasterportalLink(string name, string url, string folder, string? createdByUserId)
        {
            Id = Guid.CreateVersion7();
            Name = name;
            Url = url;
            Folder = folder;
            CreatedByUserId = createdByUserId;
            CreatedAtUtc = DateTime.UtcNow;

            Status = MasterportalLinkStatus.Pending;
            Type = InferTypeFromUrl(url);

            if (Type == MasterportalLinkType.WMS)
            {
                // wms defaults
                WmsGfiTheme = "default";
                WmsSupported = "2D,3D";
                WmsVisibility = false;
                WmsTransparent = true;
                WmsFeatureCount = "1";
                WmsTransparency = 0;
                WmsGfiAttributes = "ignore";
                WmsLayerAttribution = "nicht vorhanden";
                WmsTileSize = 512;
                WmsFormat = "image/png";
                WmsVersion = "1.3.0";
                WmsMaxScale = "2500000";
                WmsMinScale = "0";
            }
            else if (Type == MasterportalLinkType.WFS)
            {
                // wfs defaults
                WfsFeatureNs = "http://www.deegree.org/app";
                WfsVersion = "1.1.0";
            }
        }

        public static Result<MasterportalLink> Create(string name, string url, string folder, string? createdByUserId)
        {
            if (string.IsNullOrWhiteSpace(name))
                return Result.Error(TranslationKeys.MasterportalLinkNameRequired);

            if (string.IsNullOrWhiteSpace(url))
                return Result.Error(TranslationKeys.MasterportalLinkUrlRequired);

            if (string.IsNullOrWhiteSpace(folder))
                return Result.Error(TranslationKeys.MasterportalLinkFolderRequired);

            var link = new MasterportalLink(name.Trim(), url.Trim(), folder.Trim(), createdByUserId);
            return link;
        }

        public Result UpdateBasics(string name, string folder, string? updatedByUserId)
        {
            if (string.IsNullOrWhiteSpace(name))
                return Result.Error(TranslationKeys.MasterportalLinkNameRequired);
            if (string.IsNullOrWhiteSpace(folder))
                return Result.Error(TranslationKeys.MasterportalLinkFolderRequired);

            Name = name.Trim();
            Folder = folder.Trim();
            UpdatedByUserId = updatedByUserId;

            Touch();
            return Result.Ok();
        }

        public Result SetWmsMetadata(
            string layers,
            string? format,
            string? version,
            string? maxScale,
            string? minScale,
            string? legendUrl
        )
        {
            EnsureOrSetType(MasterportalLinkType.WMS);

            if (string.IsNullOrWhiteSpace(layers))
                return Result.Error(TranslationKeys.MasterportalLinkWmsLayersRequired);

            WmsLayers = layers.Trim();
            WmsFormat = string.IsNullOrWhiteSpace(format) ? "image/png" : format!.Trim();
            WmsVersion = string.IsNullOrWhiteSpace(version) ? "1.3.0" : version!.Trim();
            WmsMaxScale = string.IsNullOrWhiteSpace(maxScale) ? "2500000" : maxScale!.Trim();
            WmsMinScale = string.IsNullOrWhiteSpace(minScale) ? "0" : minScale!.Trim();
            WmsLegendUrl = legendUrl?.Trim();

            Touch();
            return Result.Ok();
        }

        public Result SetWfsMetadata(
            string featureType,
            string? featureNs,
            string? version
        )
        {
            EnsureOrSetType(MasterportalLinkType.WFS);

            if (string.IsNullOrWhiteSpace(featureType))
                return Result.Error(TranslationKeys.MasterportalLinkWfsFeatureTypeRequired);

            WfsFeatureType = featureType.Trim();
            WfsFeatureNs = string.IsNullOrWhiteSpace(featureNs) ? "http://www.deegree.org/app" : featureNs!.Trim();
            WfsVersion = string.IsNullOrWhiteSpace(version) ? "1.1.0" : version!.Trim();

            Touch();
            return Result.Ok();
        }

        private static MasterportalLinkType InferTypeFromUrl(string url)
        {
            var u = url.ToLowerInvariant();

            bool looksWms =
                u.Contains("service=wms") ||
                System.Text.RegularExpressions.Regex.IsMatch(u, @"(^|[\/_\-])wms([\/_\-]|$)");

            if (looksWms) return MasterportalLinkType.WMS;

            bool looksWfs =
                u.Contains("service=wfs") ||
                System.Text.RegularExpressions.Regex.IsMatch(u, @"(^|[\/_\-])wfs([\/_\-]|$)");

            if (looksWfs) return MasterportalLinkType.WFS;

            return MasterportalLinkType.Unknown;
        }

        private void EnsureOrSetType(MasterportalLinkType expected)
        {
            if (Type == MasterportalLinkType.Unknown)
            {
                Type = expected;
                return;
            }

            if (Type != expected)
                throw new InvalidOperationException(TranslationKeys.MasterportalLinkTypeInvalid);
        }

        private void Touch()
        {
            UpdatedAtUtc = DateTime.UtcNow;
        }
    }
}