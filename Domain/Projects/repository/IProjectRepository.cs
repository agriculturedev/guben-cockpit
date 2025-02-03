using Shared.Domain;

namespace Domain.Projects.repository;

public interface IProjectRepository : IRepository<Project, string>
{
  Task<Project?> GetIncludingUnpublished(string id);

  IEnumerable<Project> GetAllProjects();
  Task<List<Project>> GetAllByIds(IList<string> ids);
  IEnumerable<Project> GetAllOwnedBy(Guid userId);
}
