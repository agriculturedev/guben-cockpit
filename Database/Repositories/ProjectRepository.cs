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
  }

  public IEnumerable<Project> GetAllProjects()
  {
    return Set
      .AsNoTracking()
      .AsSplitQuery()
      .TagWith(nameof(ProjectRepository) + "." + nameof(GetAllProjects))
      .AsEnumerable();
  }
}
