using Database.Comparers;
using Domain.DashboardDropdown;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Database.EntityConfigurations;

public sealed class DashboardDropdownConfiguration : IEntityTypeConfiguration<DashbaordDropdown>
{
  public void Configure(EntityTypeBuilder<DashbaordDropdown> builder)
  {
    builder.ToTable("DashboardDropdown");

    builder.HasKey(e => e.Id);
    builder.Property(e => e.Id).ValueGeneratedNever();

    var converter = I18NConverter<DashboardDropdownI18NData>.CreateNew();
    var comparer  = I18NComparer<DashboardDropdownI18NData>.CreateNew();

    builder.Property(e => e.Translations)
      .HasColumnType("jsonb")
      .HasConversion(converter)
      .Metadata.SetValueComparer(comparer);

    builder.Property(e => e.IsLink);
    builder.Property(e => e.Rank).IsRequired();

    builder.HasIndex(e => e.Rank);
  }
}
