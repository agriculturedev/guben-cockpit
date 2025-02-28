using Database.Converters;
using Domain.Category;
using Domain.Events;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Database.EntityConfigurations;

public class EventConfiguration : IEntityTypeConfiguration<Event>
{
  public void Configure(EntityTypeBuilder<Event> builder)
  {
    builder.ToTable("Event");

    builder.HasKey(e => e.Id);
    builder.Property(e => e.Id).ValueGeneratedNever();

    builder.Property(e => e.EventId);
    builder.Property(e => e.TerminId);
    builder.HasIndex(e => new { e.EventId, e.TerminId });

    builder.Property(e => e.Title);
    builder.Property(e => e.Description);
    builder.Property(e => e.StartDate);
    builder.Property(e => e.EndDate);
    builder.Property(e => e.Published);
    builder.Property(e => e.Coordinates)
      .HasConversion(new CoordinatesConverter());

    builder.HasOne(e => e.Location)
      .WithMany(l => l.Events)
      .HasForeignKey("LocationId")
      .OnDelete(DeleteBehavior.Restrict); // or any delete behavior you prefer

    builder.OwnsMany(e => e.Urls, urlBuilder =>
    {
      urlBuilder.ToTable("Url");
      urlBuilder.WithOwner().HasForeignKey("EventId");

      urlBuilder.Property(u => u.Link).IsRequired();
      urlBuilder.Property(u => u.Description).IsRequired();
    });

    builder.HasMany(e => e.Categories)
      .WithMany(c => c.Events)
      .UsingEntity<Dictionary<string, object>>(
        "EventCategory",
        j => j.HasOne<Category>()
          .WithMany()
          .HasForeignKey("CategoriesId")
          .HasPrincipalKey(c => c.Id)  // Explicitly reference Category.Id
          .OnDelete(DeleteBehavior.Cascade),

        j => j.HasOne<Event>()
          .WithMany()
          .HasForeignKey("EventsId")
          .HasPrincipalKey(e => e.Id)  // Explicitly reference Event.Id
          .OnDelete(DeleteBehavior.Cascade),

        ecb =>
        {
          ecb.HasKey("CategoriesId", "EventsId");
          ecb.HasIndex("EventsId");
          ecb.HasIndex("CategoriesId");
          ecb.ToTable("EventCategory");  // Ensure table name is correct
        }
      );
  }
}
