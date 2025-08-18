using Shared.Domain;

namespace Domain.Projects.repository;

public interface IProjectRepository : IRepository<Project, string>
{
  Task<PagedResult<Project>> GetAllPagedBusinesses(PagedCriteria criteria);
  IEnumerable<Project> GetAllNonBusinesses();
  IEnumerable<Project> GetAllSchools();

  Task<Project?> GetIncludingDeletedAndUnpublished(string id);
  Task<Project?> GetIncludingUnpublished(string id);
  IEnumerable<Project> GetAllIncludingUnpublished();
  IEnumerable<Project> GetAllProjects();
  Task<List<Project>> GetAllByIds(IList<string> ids);
  Task<List<Project>> GetAllByIdsIncludingUnpublished(IList<string> ids);
  IEnumerable<Project> GetAllOwnedBy(Guid userId);
  Task<PagedResult<Project>> GetAllOwnedByUserPaged(Guid userId, PagedCriteria pagination);
}
