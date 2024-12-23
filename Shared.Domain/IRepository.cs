
using System.Linq.Expressions;

namespace Shared.Domain;

public interface IRepository<TEntity, TKey> where
    TEntity : Entity<TKey>
{
    Task<TEntity?> Get(TKey id);

    /// <summary>
    /// Returns all entities, use sparingly because performance might be terrible
    /// </summary>
    /// <returns>All entities of a specific type</returns>
    Task<List<TEntity>> GetAll();
    Task<List<TProjection>> GetAll<TProjection>(Expression<Func<TEntity, TProjection>> projection);
    Task SaveAsync(TEntity entity);
    void Save(TEntity entity);
    void Delete(TEntity entity);
}