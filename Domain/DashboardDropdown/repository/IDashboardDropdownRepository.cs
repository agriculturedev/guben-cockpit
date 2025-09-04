using Shared.Domain;

namespace Domain.DashboardDropdown.repository;

public interface IDashboardDropdownRepository : IRepository<DashbaordDropdown, Guid>
{
  int GetNextRank();
}
