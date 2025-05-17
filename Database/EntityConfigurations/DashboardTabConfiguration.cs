using System.Text.Json;
using Domain.DashboardTab;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Database.EntityConfigurations;

public class DashboardTabConfiguration : IEntityTypeConfiguration<DashboardTab>
{
  public void Configure(EntityTypeBuilder<DashboardTab> builder)
  {
    builder.ToTable("DashboardTab");

    builder.HasKey(e => e.Id);
    builder.Property(e => e.Id).ValueGeneratedNever();

    var jsonOptions = new JsonSerializerOptions();

    var converter = new ValueConverter<Dictionary<string, DashboardTabI18NData>, string>(
      v => JsonSerializer.Serialize(v, jsonOptions),
      v => JsonSerializer.Deserialize<Dictionary<string, DashboardTabI18NData>>(v, jsonOptions) ??
           new Dictionary<string, DashboardTabI18NData>()
    );

    // Define a value comparer for the dictionary, EF uses this for change tracking
    var comparer = new ValueComparer<Dictionary<string, DashboardTabI18NData>>(
      (d1, d2) => JsonSerializer.Serialize(d1, jsonOptions) ==
                  JsonSerializer.Serialize(d2, jsonOptions), // Compare as JSON
      d => JsonSerializer.Serialize(d, jsonOptions).GetHashCode(), // Hash the JSON string
      d => JsonSerializer.Deserialize<Dictionary<string, DashboardTabI18NData>>(JsonSerializer.Serialize(d, jsonOptions),
        jsonOptions)! // Clone via JSON
    );

    // Apply the conversion and comparer to the Translations property
    builder.Property(p => p.Translations)
      .HasColumnType("jsonb")
      .HasConversion(converter)
      .Metadata.SetValueComparer(comparer);

    builder.Property(e => e.Sequence);
    builder.Property(e => e.MapUrl);

    builder.OwnsMany(e => e.InformationCards, icb =>
    {
      icb.ToTable("InformationCard");
      icb.WithOwner().HasForeignKey("DashboardTabId");

      icb.HasKey(p => p.Id);
      icb.Property(p => p.Id).ValueGeneratedNever();

      var jsonOptions = new JsonSerializerOptions();

      var converter = new ValueConverter<Dictionary<string, DashboardCardI18NData>, string>(
        v => JsonSerializer.Serialize(v, jsonOptions),
        v => JsonSerializer.Deserialize<Dictionary<string, DashboardCardI18NData>>(v, jsonOptions) ??
             new Dictionary<string, DashboardCardI18NData>()
      );

      // Define a value comparer for the dictionary, EF uses this for change tracking
      var comparer = new ValueComparer<Dictionary<string, DashboardCardI18NData>>(
        (d1, d2) => JsonSerializer.Serialize(d1, jsonOptions) ==
                    JsonSerializer.Serialize(d2, jsonOptions), // Compare as JSON
        d => JsonSerializer.Serialize(d, jsonOptions).GetHashCode(), // Hash the JSON string
        d => JsonSerializer.Deserialize<Dictionary<string, DashboardCardI18NData>>(JsonSerializer.Serialize(d, jsonOptions),
          jsonOptions)! // Clone via JSON
      );

      // Apply the conversion and comparer to the Translations property
      icb.Property(p => p.Translations)
        .HasColumnType("jsonb")
        .HasConversion(converter)
        .Metadata.SetValueComparer(comparer);

      icb.Property(p => p.ImageUrl);
      icb.OwnsOne(p => p.Button, bb =>
      {
        bb.Property(p => p.Title);
        bb.Property(p => p.Url);
        bb.Property(p => p.OpenInNewTab);
      });
    });
  }
}
