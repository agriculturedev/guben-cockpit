using Shared.Domain;

namespace Domain.DashboardTab.repository;

public interface IDashboardRepository : IRepository<DashboardTab, Guid>
{
  int GetNextSequence();

  Task<List<DashboardTab>> GetByDropdownIdsAsync(
    IEnumerable<Guid> dropdownIds,
    CancellationToken cancellationToken);

  Task<List<DashboardTab>> GetTrackedByDropdownIdsAsync(
    Guid dropdownId,
    CancellationToken cancellationToken);
}
