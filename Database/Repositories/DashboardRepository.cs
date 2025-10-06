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
      .Select(tab => (int?)tab.Sequence) // Ensure nullable to handle empty case
      .Max();

    if (currentMaxSequence.HasValue)
      return currentMaxSequence.Value + 1;

    return 0;
  }

  public async Task<List<DashboardTab>> GetByDropdownIdsAsync(
  IEnumerable<Guid> dropdownIds,
  CancellationToken cancellationToken)
  {
    var ids = dropdownIds.Distinct().ToList();

    return await Set
      .TagWith($"{nameof(DashboardRepository)}.{nameof(GetByDropdownIdsAsync)}")
      .Where(t => t.DropdownId.HasValue && ids.Contains(t.DropdownId.Value))
      .AsNoTracking()
      .ToListAsync(cancellationToken);
  }

  public async Task<List<DashboardTab>> GetTrackedByDropdownIdsAsync(
    Guid dropdownId,
    CancellationToken cancellationToken)
  {
    return await Set
        .TagWith($"{nameof(DashboardRepository)}.{nameof(GetTrackedByDropdownIdsAsync)}")
        .Where(t => t.DropdownId.HasValue && t.DropdownId.Value == dropdownId)
        .ToListAsync(cancellationToken);
  }
}
