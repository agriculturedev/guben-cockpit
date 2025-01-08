using Shared.Domain;

namespace Domain.Projects.repository;

public interface IProjectRepository : IRepository<Project, string>
{
  IEnumerable<Project> GetAllProjects();
}
