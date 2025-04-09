using Domain.Topic;
using Domain.Topic.repository;
using Microsoft.EntityFrameworkCore;
using Shared.Database;

namespace Database.Repositories;

public class TopicRepository
  : EntityFrameworkRepository<Topic, string, GubenDbContext>, ITopicRepository
{
  public TopicRepository(ICustomDbContextFactory<GubenDbContext> dbContextFactory)
    : base(dbContextFactory)
  {
  }

  public Task<List<Topic>> GetAllComplete(CancellationToken cancellationToken)
  {
    return Set
      .Include(t => t.DataSources)
      .ThenInclude(ds => ds.Sources)
      .ToListAsync(cancellationToken);
  }
}
