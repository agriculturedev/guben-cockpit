using System.Text.Json;
using Domain.Locations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

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

    var jsonOptions = new JsonSerializerOptions();

    var converter = new ValueConverter<Dictionary<string, LocationI18NData>, string>(
      v => JsonSerializer.Serialize(v, jsonOptions),
      v => JsonSerializer.Deserialize<Dictionary<string, LocationI18NData>>(v, jsonOptions) ??
           new Dictionary<string, LocationI18NData>()
    );

    // Define a value comparer for the dictionary, EF uses this for change tracking
    var comparer = new ValueComparer<Dictionary<string, LocationI18NData>>(
      (d1, d2) => JsonSerializer.Serialize(d1, jsonOptions) ==
                  JsonSerializer.Serialize(d2, jsonOptions), // Compare as JSON
      d => JsonSerializer.Serialize(d, jsonOptions).GetHashCode(), // Hash the JSON string
      d => JsonSerializer.Deserialize<Dictionary<string, LocationI18NData>>(JsonSerializer.Serialize(d, jsonOptions),
        jsonOptions)! // Clone via JSON
    );


    // Apply the conversion and comparer to the Translations property
    builder.Property(p => p.Translations)
      .HasColumnType("jsonb")
      .HasConversion(converter)
      .Metadata.SetValueComparer(comparer);
  }
}
