using Database.Converters;
using Domain.Coordinates;
using Domain.Events;
using Domain.Projects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Database.EntityConfigurations;

public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
  public void Configure(EntityTypeBuilder<Project> builder)
  {
    builder.ToTable("Project");

    builder.HasKey(e => e.Id);
    builder.Property(e => e.Id).ValueGeneratedNever();

    builder.Property(e => e.Title).IsRequired();
    builder.Property(e => e.Description).IsRequired();
    builder.Property(e => e.FullText).IsRequired();
    builder.Property(e => e.ImageCaption).IsRequired();
    builder.Property(e => e.ImageUrl).IsRequired();
    builder.Property(e => e.ImageCredits).IsRequired();
    builder.Property(e => e.Published).IsRequired();
  }
}
