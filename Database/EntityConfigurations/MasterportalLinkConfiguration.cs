using Domain.MasterportalLinks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Database.EntityConfigurations;

public class MasterportalLinkConfiguration : IEntityTypeConfiguration<MasterportalLink>
{
    public void Configure(EntityTypeBuilder<MasterportalLink> builder)
    {
        builder.ToTable("MasterportalLink");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).ValueGeneratedNever();

        builder.Property(x => x.CreatedAtUtc)
            .HasColumnName("created_at_utc")
            .IsRequired();

        builder.Property(x => x.CreatedByUserId)
            .HasColumnName("created_by_user_id")
            .HasMaxLength(450);

        builder.Property(x => x.UpdatedAtUtc)
            .HasColumnName("updated_at_utc");

        builder.Property(x => x.UpdatedByUserId)
            .HasColumnName("updated_by_user_id")
            .HasMaxLength(450);

        builder.Property(x => x.Status)
            .HasColumnName("status")
            .HasConversion<string>()
            .HasMaxLength(32)
            .IsRequired();

        builder.Property(x => x.ReviewNote)
            .HasColumnName("review_note")
            .HasMaxLength(1000);

        builder.Property(x => x.Name)
            .HasColumnName("name")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(x => x.Url)
            .HasColumnName("url")
            .HasMaxLength(2048) 
            .IsRequired();

        builder.Property(x => x.Folder)
            .HasColumnName("folder")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(x => x.Type)
            .HasColumnName("type")
            .HasConversion<string>()
            .HasMaxLength(16)
            .IsRequired();

        // wms specific fields
        builder.Property(x => x.WmsLayers)
            .HasColumnName("wms_layers")
            .HasMaxLength(512);

        builder.Property(x => x.WmsFormat)
            .HasColumnName("wms_format")
            .HasMaxLength(64);

        builder.Property(x => x.WmsVersion)
            .HasColumnName("wms_version")
            .HasMaxLength(16);

        builder.Property(x => x.WmsGfiTheme)
            .HasColumnName("wms_gfi_theme")
            .HasMaxLength(64);

        builder.Property(x => x.WmsMaxScale)
            .HasColumnName("wms_max_scale")
            .HasMaxLength(32);

        builder.Property(x => x.WmsMinScale)
            .HasColumnName("wms_min_scale")
            .HasMaxLength(32);

        builder.Property(x => x.WmsTileSize)
            .HasColumnName("wms_tile_size");

        builder.Property(x => x.WmsLegendUrl)
            .HasColumnName("wms_legend_url")
            .HasMaxLength(2048);

        builder.Property(x => x.WmsSupported)
            .HasColumnName("wms_supported")
            .HasMaxLength(32); 

        builder.Property(x => x.WmsVisibility)
            .HasColumnName("wms_visibility");

        builder.Property(x => x.WmsTransparent)
            .HasColumnName("wms_transparent");

        builder.Property(x => x.WmsFeatureCount)
            .HasColumnName("wms_feature_count")
            .HasMaxLength(8);

        builder.Property(x => x.WmsTransparency)
            .HasColumnName("wms_transparency");

        builder.Property(x => x.WmsGfiAttributes)
            .HasColumnName("wms_gfi_attributes")
            .HasMaxLength(64);

        builder.Property(x => x.WmsLayerAttribution)
            .HasColumnName("wms_layer_attribution")
            .HasMaxLength(256);

        // wfs specific fields
        builder.Property(x => x.WfsFeatureType)
            .HasColumnName("wfs_feature_type")
            .HasMaxLength(256);

        builder.Property(x => x.WfsFeatureNs)
            .HasColumnName("wfs_feature_ns")
            .HasMaxLength(512);

        builder.Property(x => x.WfsVersion)
            .HasColumnName("wfs_version")
            .HasMaxLength(16);

        builder.HasIndex(x => new { x.Status, x.Type })
            .HasDatabaseName("ix_masterportal_links_status_type");

        builder.HasIndex(x => x.Folder)
            .HasDatabaseName("ix_masterportal_links_folder");

        builder.HasIndex(x => x.CreatedAtUtc)
            .HasDatabaseName("ix_masterportal_links_created_at");
    }
}