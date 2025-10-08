using Shared.Database;
using Domain.MasterportalLinks;
using Domain.MasterportalLinks.repository;
using Microsoft.EntityFrameworkCore;

namespace Database.Repositories;

public class MasterportalLinkRepository
  : EntityFrameworkRepository<MasterportalLink, Guid, GubenDbContext>, IMasterportalLinkRepository
{
  public MasterportalLinkRepository(ICustomDbContextFactory<GubenDbContext> dbContextFactory)
    : base(dbContextFactory)
  {
  }

  public async Task<IReadOnlyList<MasterportalLink>> GetAllCreatedBy(string userId, CancellationToken cancellationToken = default)
  {
    return await Set
      .AsNoTracking()
      .AsSplitQuery()
      .Where(e => e.CreatedByUserId == userId)
      .ToListAsync(cancellationToken);
  }
}
