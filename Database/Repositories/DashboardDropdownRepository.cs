using Domain.DashboardDropdown.repository;
using Domain.DashboardDropdown;
using Microsoft.EntityFrameworkCore;
using Shared.Database;

namespace Database.Repositories;

public class DashboardDropdownRepository
  : EntityFrameworkRepository<DashbaordDropdown, Guid, GubenDbContext>, IDashboardDropdownRepository
{
  public DashboardDropdownRepository(ICustomDbContextFactory<GubenDbContext> dbContextFactory)
    : base(dbContextFactory)
  {
  }

  public int GetNextRank()
  {
    var currentMaxRank = Set.
      TagWith(nameof(DashboardRepository) + "." + nameof(GetNextRank))
      .Select(tab => (int?)tab.Rank) // Ensure nullable to handle empty case
      .Max();

    if (currentMaxRank.HasValue)
      return currentMaxRank.Value + 1;

    return 0;
  }
}
