using Domain.DropdownLink;
using Domain.DropdownLink.repository;
using Microsoft.EntityFrameworkCore;
using Shared.Database;

namespace Database.Repositories;

public class DropdownLinkRepository
: EntityFrameworkRepository<DropdownLink, Guid, GubenDbContext>, IDropdownLinkRepository
{
    public DropdownLinkRepository(ICustomDbContextFactory<GubenDbContext> dbContextFactory)
        : base(dbContextFactory)
    {
    }

    public int GetNextSequence()
    {
        var currentMaxSequence = Set
            .TagWith(nameof(DropdownLinkRepository) + "." + nameof(GetNextSequence))
            .Select(link => (int?)link.Sequence) // Ensure nullable to handle empty case
            .Max();

        if (currentMaxSequence.HasValue)
            return currentMaxSequence.Value + 1;

        return 0;
    }

    public async Task<List<DropdownLink>> GetByDropdownIdsAsync(
    IEnumerable<Guid> dropdownIds,
    CancellationToken cancellationToken)
    {
        var ids = dropdownIds.Distinct().ToList();

        return await Set
        .TagWith($"{nameof(DashboardRepository)}.{nameof(GetByDropdownIdsAsync)}")
        .Where(t => ids.Contains(t.DropdownId))
        .AsNoTracking()
        .ToListAsync(cancellationToken);
    }
}