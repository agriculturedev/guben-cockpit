using Database.Comparers;
using Domain.Locations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Database.EntityConfigurations;

public class LocationConfiguration : IEntityTypeConfiguration<Location>
{
  public void Configure(EntityTypeBuilder<Location> builder)
  {
    builder.ToTable("Location");

    builder.HasKey(e => e.Id);
    builder.Property(e => e.Id).ValueGeneratedNever();

    builder.Property(e => e.City);
    builder.Property(e => e.Street);
    builder.Property(e => e.TelephoneNumber);
    builder.Property(e => e.Fax);
    builder.Property(e => e.Email);
    builder.Property(e => e.Website);
    builder.Property(e => e.Zip);

    var converter = I18NConverter<LocationI18NData>.CreateNew();

    // Define a value comparer for the dictionary, EF uses this for change tracking
    var comparer = I18NComparer<LocationI18NData>.CreateNew();

    // Apply the conversion and comparer to the Translations property
    builder.Property(p => p.Translations)
      .HasColumnType("jsonb")
      .HasConversion(converter)
      .Metadata.SetValueComparer(comparer);
  }
}
