using Shared.Database;
using Domain.MasterportalLinks;
using Domain.MasterportalLinks.repository;

namespace Database.Repositories;

public class MasterportalLinkRepository
  : EntityFrameworkRepository<MasterportalLink, Guid, GubenDbContext>, IMasterportalLinkRepository
{
  public MasterportalLinkRepository(ICustomDbContextFactory<GubenDbContext> dbContextFactory)
    : base(dbContextFactory)
  {
  }
}
