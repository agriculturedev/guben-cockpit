using Domain.DashboardTab;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Database.EntityConfigurations;

public class DashboardTabConfiguration : IEntityTypeConfiguration<DashboardTab>
{
  public void Configure(EntityTypeBuilder<DashboardTab> builder)
  {
    builder.ToTable("DashboardTab");

    builder.HasKey(e => e.Id);
    builder.Property(e => e.Id).ValueGeneratedNever();

    builder.Property(e => e.Title);
    builder.Property(e => e.Sequence);
    builder.Property(e => e.MapUrl);

    builder.OwnsMany(e => e.InformationCards, icb =>
    {
      icb.ToTable("InformationCard");
      icb.WithOwner().HasForeignKey("DashboardTabId");

      icb.HasKey(p => p.Id);
      icb.Property(p => p.Id).ValueGeneratedNever();

      icb.Property(p => p.Title);
      icb.Property(p => p.Description);
      icb.Property(p => p.ImageUrl);
      icb.Property(p => p.ImageAlt);
      icb.OwnsOne(p => p.Button, bb =>
      {
        bb.Property(p => p.Title);
        bb.Property(p => p.Url);
        bb.Property(p => p.OpenInNewTab);
      });
    });
  }
}
