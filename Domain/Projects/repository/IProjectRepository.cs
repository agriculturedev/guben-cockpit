using Shared.Domain;

namespace Domain.Projects.repository;

public interface IProjectRepository : IRepository<Project, string>
{
  IEnumerable<Project> GetAllProjects();
  Task<List<Project>> GetAllByIds(IList<string> ids);
}
