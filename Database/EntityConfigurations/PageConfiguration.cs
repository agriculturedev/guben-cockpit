using Domain.Category;
using Domain.Events;
using Domain.Locations;
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

    builder.Property(e => e.Title);
    builder.Property(e => e.Description);
  }
}
