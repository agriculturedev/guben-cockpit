using Domain.Topic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Database.EntityConfigurations;

public class DataSourceConfiguration : IEntityTypeConfiguration<DataSource>
{
  public void Configure(EntityTypeBuilder<DataSource> builder)
  {
    builder.ToTable("DataSource");

    builder.HasKey(ds => ds.Id);
    builder.Property(e => e.Id).ValueGeneratedNever();

    builder.Property(e => e.Name);

    builder.HasMany(e => e.Sources)
      .WithOne()
      .HasForeignKey("DataSourceId");
  }
}
