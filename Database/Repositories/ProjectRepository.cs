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

  private readonly IQueryable<Project> _publishedSet;

  public ProjectRepository(ICustomDbContextFactory<GubenDbContext> dbContextFactory)
    : base(dbContextFactory)
  {
    _publishedSet = Set.Where(p => p.Published);
  }

  public IEnumerable<Project> GetAllProjects()
  {
    return _publishedSet
      .AsNoTracking()
      .AsSplitQuery()
      .TagWith(nameof(ProjectRepository) + "." + nameof(GetAllProjects))
      .AsEnumerable();
  }

  public Task<List<Project>> GetAllByIds(IList<string> ids)
  {
    return _publishedSet
      .TagWith(nameof(ProjectRepository) + "." + nameof(GetAllByIds))
      .Where(p => ids.Contains(p.Id))
      .ToListAsync();
  }
}
