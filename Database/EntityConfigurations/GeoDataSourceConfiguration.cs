using Domain.GeoDataSource;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Database.EntityConfigurations;

public class GeoDataSourceConfiguration : IEntityTypeConfiguration<GeoDataSource>
{
  public void Configure(EntityTypeBuilder<GeoDataSource> builder)
  {
    builder.ToTable("GeoDataSource");

    builder.HasKey(e => e.Id);
    builder.Property(e => e.Id).ValueGeneratedNever();

    builder.Property(e => e.Path);
    builder.Property(e => e.IsValidated);
    builder.Property(e => e.IsPublic);
  }
}
