using System.Linq.Expressions;

namespace Shared.Domain;

public interface IRepository<TEntity, TKey> where
  TEntity : Entity<TKey>
{
  Task<TEntity?> Get(TKey id);

  Task<TEntity?> GetNonTracking(TKey id);
  Task<TEntity?> GetNonTrackingSplitQuery(TKey id);
  Task<TProjection?> GetNonTrackingProjected<TProjection>(TKey id, Expression<Func<TEntity, TProjection>> projection);
  Task<TProjection?> GetNonTrackingSplitQueryProjected<TProjection>(TKey id, Expression<Func<TEntity, TProjection>> projection);

  /// <summary>
  /// Returns all entities, use sparingly because performance might be terrible
  /// </summary>
  /// <returns>All entities of a specific type</returns>
  Task<List<TEntity>> GetAll();
  Task<PagedResult<TEntity>> GetAllPaged(PagedCriteria criteria);
  Task<List<TProjection>> GetAllProjected<TProjection>(Expression<Func<TEntity, TProjection>> projection);
  Task<List<TProjection>> GetAllNonTrackingProjected<TProjection>(Expression<Func<TEntity, TProjection>> projection);
  Task<List<TProjection>> GetAllNonTrackingSplitQueryProjected<TProjection>(Expression<Func<TEntity, TProjection>> projection);
  Task SaveAsync(TEntity entity);
  void Save(TEntity entity);
  void Delete(TEntity entity);
}
