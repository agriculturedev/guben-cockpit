using Shared.Domain;

namespace Domain.DashboardTab.repository;

public interface IDashboardRepository : IRepository<DashboardTab, Guid>
{
  int GetNextSequence();
}
