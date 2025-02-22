using System.Text.Json;
using Domain.Pages;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Database.EntityConfigurations;

public class PageConfiguration : IEntityTypeConfiguration<Page>
{
  public void Configure(EntityTypeBuilder<Page> builder)
  {
    builder.ToTable("Page");

    builder.HasKey(e => e.Id);
    builder.Property(e => e.Id).ValueGeneratedNever();


    var jsonOptions = new JsonSerializerOptions();

    var converter = new ValueConverter<Dictionary<string, PageI18NData>, string>(
      v => JsonSerializer.Serialize(v, jsonOptions),
      v => JsonSerializer.Deserialize<Dictionary<string, PageI18NData>>(v, jsonOptions) ??
           new Dictionary<string, PageI18NData>()
    );

    // Define a value comparer for the dictionary, EF uses this for change tracking
    var comparer = new ValueComparer<Dictionary<string, PageI18NData>>(
      (d1, d2) => JsonSerializer.Serialize(d1, jsonOptions) ==
                  JsonSerializer.Serialize(d2, jsonOptions), // Compare as JSON
      d => JsonSerializer.Serialize(d, jsonOptions).GetHashCode(), // Hash the JSON string
      d => JsonSerializer.Deserialize<Dictionary<string, PageI18NData>>(JsonSerializer.Serialize(d, jsonOptions),
        jsonOptions)! // Clone via JSON
    );

    // Apply the conversion and comparer to the Translations property
    builder.Property(p => p.Translations)
      .HasColumnType("jsonb")
      .HasConversion(converter)
      .Metadata.SetValueComparer(comparer);
  }
}
