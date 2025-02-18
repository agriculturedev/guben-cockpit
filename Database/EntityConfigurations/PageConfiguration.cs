using Domain.Pages;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Database.EntityConfigurations;

public class PageConfiguration : IEntityTypeConfiguration<Page>
{
  public void Configure(EntityTypeBuilder<Page> builder)
  {
    builder.ToTable("Page");

    builder.HasKey(e => e.Id);
    builder.Property(e => e.Id).ValueGeneratedNever();

    // builder.Property(e => e.Title);
    // builder.Property(e => e.Description);

    // Configure the Translations property to be stored as jsonb.
    builder.Property(p => p.Translations)
      // .HasConversion(
      //   // Convert dictionary to JSON string for storage.
      //   v => JsonSerializer.Serialize(v, new JsonSerializerOptions()),
      //   v => JsonSerializer
      //          .Deserialize<Dictionary<string, PageI18NData>>(v, new JsonSerializerOptions())
      //           ?? new Dictionary<string, PageI18NData>())
      .HasColumnType("jsonb");
  }
}
