using Domain.Topic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Database.EntityConfigurations;

public class TopicConfiguration : IEntityTypeConfiguration<Topic>
{
  public void Configure(EntityTypeBuilder<Topic> builder)
  {
    builder.ToTable("Topic");

    builder.HasKey(e => e.Id);
    builder.Property(e => e.Id).ValueGeneratedNever();

    builder.HasMany(e => e.DataSources)
      .WithOne()
      .HasForeignKey("TopicId");
  }
}
