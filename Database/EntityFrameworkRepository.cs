using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Shared.Database;
using Shared.Domain;

namespace Database;

public abstract class EntityFrameworkRepository<TEntity, TKey, TContext> : IRepository<TEntity, TKey>
    where TEntity : Entity<TKey>
    where TKey : IComparable<TKey>
    where TContext : DbContext
{
    private readonly ICustomDbContextFactory<TContext> _dbContextFactory;

    protected EntityFrameworkRepository(ICustomDbContextFactory<TContext> dbContextFactory)
    {
        _dbContextFactory = dbContextFactory;
    }

    protected TContext Context => _dbContextFactory.CreateDbContext();
    protected DbSet<TEntity> Set => _dbContextFactory.CreateDbContext().Set<TEntity>();

    public Task<TEntity?> Get(TKey id)
    {
        return Set
            .TagWith(GetType().Name + '.' + nameof(Get))
            .AsSplitQuery()
            .SingleOrDefaultAsync(a => a.Id.Equals(id));
    }

    public Task<List<TEntity>> GetAll()
    {
        return Set
            .TagWith(GetType().Name + '.' + nameof(GetAll))
            .IgnoreAutoIncludes()
            .ToListAsync();
    }

    public Task<List<TProjection>> GetAll<TProjection>(Expression<Func<TEntity, TProjection>> projection)
    {
        return Set
            .TagWith(GetType().Name + '.' + nameof(GetAll))
            .IgnoreAutoIncludes()
            .Select(projection)
            .ToListAsync();
    }

    public virtual async Task SaveAsync(TEntity entity)
    {
        if (!Set.Local.Contains(entity))
            await Set.AddAsync(entity);
    }

    public virtual void Save(TEntity entity)
    {
        if (!Set.Local.Contains(entity))
            Set.Add(entity);
    }

    public void Delete(TEntity entity)
    {
        Set.Remove(entity);
    }
}