using Domain.Pages;
using Domain.Pages.repository;
using Shared.Database;

namespace Database.Repositories;

public class PageRepository
  : EntityFrameworkRepository<Page, string, GubenDbContext>, IPageRepository
{
  public PageRepository(ICustomDbContextFactory<GubenDbContext> dbContextFactory)
    : base(dbContextFactory)
  {
  }

}
