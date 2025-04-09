using Domain.Topic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Database.EntityConfigurations;

public class SourceConfiguration : IEntityTypeConfiguration<Source>
{
  public void Configure(EntityTypeBuilder<Source> builder)
  {
    builder.ToTable("Source");

    builder.HasKey(e => e.Id);
    builder.Property(e => e.Id).ValueGeneratedNever();

    builder.Property(e => e.Url);
    builder.Property(e => e.Name);
    builder.Property(e => e.Type)
      .HasConversion(
      p => p.Value,
      p => SourceType.FromValue(p));;
  }
}
