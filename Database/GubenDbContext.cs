using Microsoft.EntityFrameworkCore;

namespace Database;

/// <summary>
/// The DbContext for the data layer
/// </summary>
/// <param name="options"></param>
public class GubenDbContext(DbContextOptions options) : DbContext(options)
{
    public const string DefaultSchema = "Aurora";

    // add dbsets here

    /// <summary>
    /// Configure the model that was discovered by convention from the entity types exposed in <see cref="DbSet{TEntity}"/> properties on this context.
    /// </summary>
    /// <param name="modelBuilder"></param>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema(DefaultSchema);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(GubenDbContext).Assembly);
    }

}