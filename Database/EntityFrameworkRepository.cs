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
    ModifiedSet = Set;
  }

  protected TContext Context => _dbContextFactory.CreateDbContext();
  protected DbSet<TEntity> Set => _dbContextFactory.CreateDbContext().Set<TEntity>();
  protected IQueryable<TEntity> ModifiedSet { get; set; } // used in project and user repo to apply default filters like Published or to filter out system user

   public Task<TEntity?> Get(TKey id)
    {
        return ModifiedSet
            .TagWith(GetType().Name + '.' + nameof(Get))
            .IgnoreAutoIncludes()
            .FirstOrDefaultAsync(a => a.Id.Equals(id));
    }

    public Task<TEntity?> GetNonTracking(TKey id)
    {
        return ModifiedSet
            .TagWith(GetType().Name + '.' + nameof(GetNonTracking))
            .AsNoTracking()
            .IgnoreAutoIncludes()
            .FirstOrDefaultAsync(a => a.Id.Equals(id));
    }

    public Task<TEntity?> GetNonTrackingSplitQuery(TKey id)
    {
        return ModifiedSet
            .TagWith(GetType().Name + '.' + nameof(GetNonTrackingSplitQuery))
            .AsNoTracking()
            .AsSplitQuery()
            .IgnoreAutoIncludes()
            .FirstOrDefaultAsync(a => a.Id.Equals(id));
    }

    public Task<TProjection?> GetNonTrackingProjected<TProjection>(TKey id, Expression<Func<TEntity, TProjection>> projection)
    {
        return ModifiedSet
            .TagWith(GetType().Name + '.' + nameof(GetNonTrackingProjected))
            .AsNoTracking()
            .IgnoreAutoIncludes()
            .Where(a => a.Id.Equals(id))
            .Select(projection)
            .FirstOrDefaultAsync();
    }

    public Task<TProjection?> GetNonTrackingSplitQueryProjected<TProjection>(TKey id, Expression<Func<TEntity, TProjection>> projection)
    {
        return ModifiedSet
            .TagWith(GetType().Name + '.' + nameof(GetNonTrackingSplitQueryProjected))
            .AsNoTracking()
            .AsSplitQuery()
            .IgnoreAutoIncludes()
            .Where(a => a.Id.Equals(id))
            .Select(projection)
            .FirstOrDefaultAsync();
    }

    public Task<List<TEntity>> GetAll()
    {
        return ModifiedSet
            .TagWith(GetType().Name + '.' + nameof(GetAll))
            .IgnoreAutoIncludes()
            .ToListAsync();
    }

    public Task<PagedResult<TEntity>> GetAllPaged(PagedCriteria criteria)
    {
      return ModifiedSet
        .TagWith(GetType().Name + '.' + nameof(GetAllPaged))
        .AsNoTracking()
        .IgnoreAutoIncludes()
        .ToPagedResult(criteria);
    }

    public Task<List<TProjection>> GetAllProjected<TProjection>(Expression<Func<TEntity, TProjection>> projection)
    {
        return ModifiedSet
            .TagWith(GetType().Name + '.' + nameof(GetAllProjected))
            .IgnoreAutoIncludes()
            .Select(projection)
            .ToListAsync();
    }

    public Task<List<TProjection>> GetAllNonTrackingProjected<TProjection>(Expression<Func<TEntity, TProjection>> projection)
    {
        return ModifiedSet
            .TagWith(GetType().Name + '.' + nameof(GetAllNonTrackingProjected))
            .AsNoTracking()
            .IgnoreAutoIncludes()
            .Select(projection)
            .ToListAsync();
    }
    public Task<List<TProjection>> GetAllNonTrackingSplitQueryProjected<TProjection>(Expression<Func<TEntity, TProjection>> projection)
    {
        return ModifiedSet
            .TagWith(GetType().Name + '.' + nameof(GetAllNonTrackingSplitQueryProjected))
            .AsSplitQuery()
            .AsNoTracking()
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
