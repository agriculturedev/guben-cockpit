using Shared.Domain;

namespace Domain.DropdownLink.repository;

public interface IDropdownLinkRepository : IRepository<DropdownLink, Guid>
{
  int GetNextSequence();

  Task<List<DropdownLink>> GetByDropdownIdsAsync(
    IEnumerable<Guid> dropdownIds,
    CancellationToken cancellationToken);
}
