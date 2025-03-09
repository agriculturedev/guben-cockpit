using Domain.Projects;
using Domain.Projects.repository;
using Microsoft.EntityFrameworkCore;
using Shared.Database;
using Shared.Domain;

namespace Database.Repositories;

public class ProjectRepository
  : EntityFrameworkRepository<Project, string, GubenDbContext>, IProjectRepository
{
  public ProjectRepository(ICustomDbContextFactory<GubenDbContext> dbContextFactory)
    : base(dbContextFactory)
  {
    ModifiedSet = Set.Where(p => p.Published);
  }

  public Task<PagedResult<Project>> GetAllPagedBusinesses(PagedCriteria criteria)
  {
    return ModifiedSet
      .TagWith(GetType().Name + '.' + nameof(GetAllPagedBusinesses))
      .AsNoTracking()
      .IgnoreAutoIncludes()
      .Where(p => p.IsBusiness)
      .ToPagedResult(criteria);
  }

  public Task<Project?> GetIncludingUnpublished(string id)
  {
    return Set
      .TagWith(GetType().Name + '.' + nameof(GetIncludingUnpublished))
      .IgnoreAutoIncludes()
      .FirstOrDefaultAsync(a => a.Id.Equals(id));
  }

  public IEnumerable<Project> GetAllIncludingUnpublished()
  {
    return Set
      .AsNoTracking()
      .AsSplitQuery()
      .TagWith(nameof(ProjectRepository) + "." + nameof(GetAllIncludingUnpublished))
      .AsEnumerable();
  }

  public IEnumerable<Project> GetAllProjects()
  {
    return ModifiedSet
      .AsNoTracking()
      .AsSplitQuery()
      .TagWith(nameof(ProjectRepository) + "." + nameof(GetAllProjects))
      .AsEnumerable();
  }

  public Task<List<Project>> GetAllByIds(IList<string> ids)
  {
    return ModifiedSet
      .TagWith(nameof(ProjectRepository) + "." + nameof(GetAllByIds))
      .Where(p => ids.Contains(p.Id))
      .ToListAsync();
  }

  public Task<List<Project>> GetAllByIdsIncludingUnpublished(IList<string> ids)
  {
    return Set
      .TagWith(nameof(ProjectRepository) + "." + nameof(GetAllByIdsIncludingUnpublished))
      .Where(p => ids.Contains(p.Id))
      .ToListAsync();
  }

  public IEnumerable<Project> GetAllOwnedBy(Guid userId)
  {
    return Set
      .TagWith(GetType().Name + '.' + nameof(GetAllOwnedBy))
      .IgnoreAutoIncludes()
      .Where(a => a.CreatedBy.Equals(userId))
      .AsEnumerable();
  }

  public Task<PagedResult<Project>> GetAllOwnedByUserPaged(Guid userId, PagedCriteria pagination)
  {
    return Set
      .AsNoTracking()
      .AsSplitQuery()
      .TagWith(nameof(ProjectRepository) + "." + nameof(GetAllOwnedByUserPaged))
      .Where(a => a.CreatedBy.Equals(userId))
      .ToPagedResult(pagination);
  }
}
