using Shared.Domain;

namespace Domain.MasterportalLinks.repository;

public interface IMasterportalLinkRepository : IRepository<MasterportalLink, Guid>
{
    Task<IReadOnlyList<MasterportalLink>> GetAllCreatedBy(string keycloackId, CancellationToken cancellationToken = default);
}