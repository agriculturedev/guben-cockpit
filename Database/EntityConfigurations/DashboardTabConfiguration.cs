using Database.Comparers;
using Domain.DashboardTab;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Database.EntityConfigurations;

public class DashboardTabConfiguration : IEntityTypeConfiguration<DashboardTab>
{
  public void Configure(EntityTypeBuilder<DashboardTab> builder)
  {
    builder.ToTable("DashboardTab");

    builder.HasKey(e => e.Id);
    builder.Property(e => e.Id).ValueGeneratedNever();

    var converter = I18NConverter<DashboardTabI18NData>.CreateNew();

    // Define a value comparer for the dictionary, EF uses this for change tracking
    var comparer = I18NComparer<DashboardTabI18NData>.CreateNew();


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

      var converter = I18NConverter<DashboardCardI18NData>.CreateNew();

      // Define a value comparer for the dictionary, EF uses this for change tracking
      var comparer = I18NComparer<DashboardCardI18NData>.CreateNew();

      // Apply the conversion and comparer to the Translations property
      icb.Property(p => p.Translations)
        .HasColumnType("jsonb")
        .HasConversion(converter)
        .Metadata.SetValueComparer(comparer);

      icb.Property(p => p.ImageUrl);
      icb.OwnsOne(p => p.Button, bb =>
      {
        var converter = I18NConverter<ButtonI18NData>.CreateNew();

        // Define a value comparer for the dictionary, EF uses this for change tracking
        var comparer = I18NComparer<ButtonI18NData>.CreateNew();


        bb.Property(p => p.Translations)
          .HasColumnType("jsonb")
          .HasConversion(converter)
          .Metadata.SetValueComparer(comparer);

        bb.Property(p => p.OpenInNewTab);
      });
    });
  }
}
