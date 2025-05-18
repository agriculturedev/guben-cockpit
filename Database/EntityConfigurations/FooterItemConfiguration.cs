using Domain.FooterItems;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Database.EntityConfigurations;

public class FooterItemConfiguration : IEntityTypeConfiguration<FooterItem>
{
  public void Configure(EntityTypeBuilder<FooterItem> builder)
  {
    builder.ToTable("FooterItem");

    builder.HasKey(e => e.Id);
    builder.Property(e => e.Id).ValueGeneratedNever();

    builder.Property(e => e.Name);
    builder.Property(e => e.Content);

  }
}
