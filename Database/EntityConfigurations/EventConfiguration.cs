using System.Text.Json;
using Database.Converters;
using Domain.Category;
using Domain.Events;
using Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

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

    builder.Property(e => e.StartDate);
    builder.Property(e => e.EndDate);
    builder.Property(e => e.Published);
    builder.Property(e => e.Coordinates)
      .HasConversion(new CoordinatesConverter());

    builder.HasOne<User>()
      .WithMany()
      .HasForeignKey(p => p.CreatedBy)
      .OnDelete(DeleteBehavior.Restrict);

    var jsonOptions = new JsonSerializerOptions();

    var converter = new ValueConverter<Dictionary<string, EventI18NData>, string>(
      v => JsonSerializer.Serialize(v, jsonOptions),
      v => JsonSerializer.Deserialize<Dictionary<string, EventI18NData>>(v, jsonOptions) ??
           new Dictionary<string, EventI18NData>()
    );

    // Define a value comparer for the dictionary, EF uses this for change tracking
    var comparer = new ValueComparer<Dictionary<string, EventI18NData>>(
      (d1, d2) => JsonSerializer.Serialize(d1, jsonOptions) ==
                  JsonSerializer.Serialize(d2, jsonOptions), // Compare as JSON
      d => JsonSerializer.Serialize(d, jsonOptions).GetHashCode(), // Hash the JSON string
      d => JsonSerializer.Deserialize<Dictionary<string, EventI18NData>>(JsonSerializer.Serialize(d, jsonOptions),
        jsonOptions)! // Clone via JSON
    );


    // Apply the conversion and comparer to the Translations property
    builder.Property(p => p.Translations)
      .HasColumnType("jsonb")
      .HasConversion(converter)
      .Metadata.SetValueComparer(comparer);

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
          .HasPrincipalKey(c => c.Id) // Explicitly reference Category.Id
          .OnDelete(DeleteBehavior.Cascade),
        j => j.HasOne<Event>()
          .WithMany()
          .HasForeignKey("EventsId")
          .HasPrincipalKey(e => e.Id) // Explicitly reference Event.Id
          .OnDelete(DeleteBehavior.Cascade),
        ecb =>
        {
          ecb.HasKey("CategoriesId", "EventsId");
          ecb.HasIndex("EventsId");
          ecb.HasIndex("CategoriesId");
          ecb.ToTable("EventCategory"); // Ensure table name is correct
        }
      );
  }
}
