using Shared.Domain;

namespace Domain.Category.repository;

public interface ICategoryRepository : IRepository<Category, Guid>
{
  IEnumerable<Category> GetByIds(IEnumerable<Guid> ids);
  Task<Category?> GetByName(string name);
  Task<Category?> GetByCategoryId(int id);
}
