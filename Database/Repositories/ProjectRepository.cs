using Domain.Events;
using Domain.Events.repository;
using Domain.Projects;
using Domain.Projects.repository;
using Microsoft.EntityFrameworkCore;
using Shared.Database;

namespace Database.Repositories;

public class ProjectRepository
  : EntityFrameworkRepository<Project, string, GubenDbContext>, IProjectRepository
{
  public ProjectRepository(ICustomDbContextFactory<GubenDbContext> dbContextFactory)
    : base(dbContextFactory)
  {
    ModifiedSet = Set.Where(p => p.Published);
  }

  public Task<Project?> GetIncludingUnpublished(string id)
  {
    return Set
      .TagWith(GetType().Name + '.' + nameof(GetIncludingUnpublished))
      .IgnoreAutoIncludes()
      .FirstOrDefaultAsync(a => a.Id.Equals(id));
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
}
