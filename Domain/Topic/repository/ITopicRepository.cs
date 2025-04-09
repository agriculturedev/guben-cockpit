using Shared.Domain;

namespace Domain.Topic.repository;

public interface ITopicRepository : IRepository<Topic, string>
{
  Task<List<Topic>> GetAllComplete(CancellationToken cancellationToken);
}
