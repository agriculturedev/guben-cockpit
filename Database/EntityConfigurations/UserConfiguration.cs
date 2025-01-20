using Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Database.EntityConfigurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
  public void Configure(EntityTypeBuilder<User> builder)
  {
    builder.ToTable("User");

    builder.HasKey(e => e.Id);
    builder.Property(e => e.Id).ValueGeneratedNever();

    builder.Property(e => e.KeycloakId).HasMaxLength(50);
    builder.Property(e => e.FirstName).HasMaxLength(50);
    builder.Property(e => e.LastName).HasMaxLength(50);
    builder.Property(e => e.Email).HasMaxLength(100);
  }
}
