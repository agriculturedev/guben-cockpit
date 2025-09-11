using Shared.Domain;

namespace Domain.DropdownLink.repository;

public interface IDropdownLinkRepository : IRepository<DropdownLink, Guid>
{
  int GetNextSequence();
}
