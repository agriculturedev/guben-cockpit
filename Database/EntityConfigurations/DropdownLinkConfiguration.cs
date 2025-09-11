using Database.Comparers;
using Domain.DropdownLink;
using Domain.DashboardDropdown;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Database.EntityConfigurations;

public sealed class DropdownLinkConfiguration : IEntityTypeConfiguration<DropdownLink>
{
    public void Configure(EntityTypeBuilder<DropdownLink> builder)
    {
        builder.ToTable("DropdownLink");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).ValueGeneratedNever();

        var converter = I18NConverter<DropdownLinkI18NData>.CreateNew();
        var comparer  = I18NComparer<DropdownLinkI18NData>.CreateNew();

        builder.Property(p => p.Translations)
            .HasColumnType("jsonb")
            .HasConversion(converter)
            .Metadata.SetValueComparer(comparer);

        builder.Property(e => e.Link)
            .IsRequired();

        builder.Property(e => e.Sequence)
            .IsRequired();

        builder.Property(e => e.DropdownId)
            .IsRequired();

        builder.HasIndex(e => new { e.DropdownId, e.Sequence });

        builder.HasOne<DashbaordDropdown>()
            .WithMany()
            .HasForeignKey(e => e.DropdownId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
