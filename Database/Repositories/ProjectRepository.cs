using Domain.Events;
using Domain.Events.repository;
using Domain.Projects;
using Domain.Projects.repository;
using Microsoft.EntityFrameworkCore;
using Shared.Database;

namespace Database.Repositories;

public class Projectepository
  : EntityFrameworkRepository<Project, string, GubenDbContext>, IProjectRepository
{
  public Projectepository(ICustomDbContextFactory<GubenDbContext> dbContextFactory)
    : base(dbContextFactory)
  {
  }
}
