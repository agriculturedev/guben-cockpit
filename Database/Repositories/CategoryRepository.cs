using Domain.Category;
using Domain.Category.repository;
using Domain.Events;
using Domain.Events.repository;
using Domain.Locations;
using Domain.Locations.repository;
using Microsoft.EntityFrameworkCore;
using Shared.Database;

namespace Database.Repositories;

public class CategoryRepository
  : EntityFrameworkRepository<Category, Guid, GubenDbContext>, ICategoryRepository
{
  public CategoryRepository(ICustomDbContextFactory<GubenDbContext> dbContextFactory)
    : base(dbContextFactory)
  {
  }

  public IEnumerable<Category> GetByIds(IEnumerable<Guid> ids)
  {
    return Set
      .AsNoTracking()
      .Where(x => ids.Contains(x.Id));
  }

  public Task<Category?> GetByName(string name)
  {
    return Set
      .FirstOrDefaultAsync(x => x.Name == name);
  }

  public Task<Category?> GetByCategoryId(int id)
  {
    return Set
      .FirstOrDefaultAsync(x => x.CategoryId == id);
  }
}
