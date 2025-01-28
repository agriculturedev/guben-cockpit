using Domain.DashboardTab;
using Domain.DashboardTab.repository;
using Shared.Database;

namespace Database.Repositories;

public class DashboardRepository
  : EntityFrameworkRepository<DashboardTab, Guid, GubenDbContext>, IDashboardRepository
{
  public DashboardRepository(ICustomDbContextFactory<GubenDbContext> dbContextFactory)
    : base(dbContextFactory)
  {
  }

}
