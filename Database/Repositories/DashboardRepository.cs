using Domain.DashboardTab;
using Domain.DashboardTab.repository;
using Microsoft.EntityFrameworkCore;
using Shared.Database;

namespace Database.Repositories;

public class DashboardRepository
  : EntityFrameworkRepository<DashboardTab, Guid, GubenDbContext>, IDashboardRepository
{
  public DashboardRepository(ICustomDbContextFactory<GubenDbContext> dbContextFactory)
    : base(dbContextFactory)
  {
  }

  public int GetNextSequence()
  {
    var currentMaxSequence = Set.
      TagWith(nameof(DashboardRepository) + "." + nameof(GetNextSequence))
      .Max(tab => tab.Sequence);

    return currentMaxSequence + 1;
  }
}
