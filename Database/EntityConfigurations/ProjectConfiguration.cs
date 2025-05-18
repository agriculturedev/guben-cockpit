using Domain.Projects;
using Domain.Users;
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

    builder.Property(e => e.Type)
      .HasConversion(
        p => p.Value,
        p => ProjectType.FromValue(p))
      .IsRequired();

    builder.Property(e => e.Title).IsRequired();
    builder.Property(e => e.Description);
    builder.Property(e => e.FullText);
    builder.Property(e => e.ImageCaption);
    builder.Property(e => e.ImageUrl);
    builder.Property(e => e.ImageCredits);
    builder.Property(e => e.Published).IsRequired();
    builder.Property(e => e.IsBusiness);
    builder.HasOne<User>()
      .WithMany()
      .HasForeignKey(p => p.CreatedBy)
      .OnDelete(DeleteBehavior.Restrict);
  }
}
