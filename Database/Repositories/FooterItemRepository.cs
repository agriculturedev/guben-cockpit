using Domain.FooterItems;
using Domain.FooterItems.repository;
using Shared.Database;

namespace Database.Repositories;

public class FooterItemRepository : EntityFrameworkRepository<FooterItem, Guid, GubenDbContext>, IFooterItemRepository

{
  public FooterItemRepository(ICustomDbContextFactory<GubenDbContext> dbContextFactory) : base(dbContextFactory) { }
}
