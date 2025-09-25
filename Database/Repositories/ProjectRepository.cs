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
      .Where(p => p.Type == ProjectType.GubenerMarktplatz.Value)
      .ToPagedResult(criteria);
  }

  public IEnumerable<Project> GetAllNonBusinesses()
  {
    return ModifiedSet
      .TagWith(GetType().Name + '.' + nameof(GetAllNonBusinesses))
      .AsNoTracking()
      .IgnoreAutoIncludes()
      .Where(p => p.Type == ProjectType.Stadtentwicklung.Value)
      .AsEnumerable();
  }

  public IEnumerable<Project> GetAllSchools()
  {
    return ModifiedSet
      .TagWith(GetType().Name + '.' + nameof(GetAllSchools))
      .AsNoTracking()
      .IgnoreAutoIncludes()
      .Where(p => p.Type == ProjectType.Schule.Value)
      .AsEnumerable();
  }

  public Task<Project?> GetIncludingUnpublished(string id)
  {
    return Set
      .TagWith(GetType().Name + '.' + nameof(GetIncludingUnpublished))
      .IgnoreAutoIncludes()
      .FirstOrDefaultAsync(a => a.Id.Equals(id));
  }

  public Task<Project?> GetIncludingDeletedAndUnpublished(string id)
  {
    return Set
      .TagWith(GetType().Name + "." + nameof(GetIncludingDeletedAndUnpublished))
      .IgnoreAutoIncludes()
      .IgnoreQueryFilters()
      .FirstOrDefaultAsync(a => a.Id.Equals(id));
  }

  public Task<List<Project>> GetAllIncludingUnpublished()
  {
    return Set
      .AsNoTracking()
      .AsSplitQuery()
      .TagWith(nameof(ProjectRepository) + "." + nameof(GetAllIncludingUnpublished))
      .ToListAsync();
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

  public Task<List<Project>> GetAllOwnedByOrEditor(Guid userId)
  {
    return Set
      .TagWith(GetType().Name + '.' + nameof(GetAllOwnedByOrEditor))
      .IgnoreAutoIncludes()
      .Where(a => a.CreatedBy.Equals(userId) || a.EditorId.Equals(userId))
      .ToListAsync();
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
