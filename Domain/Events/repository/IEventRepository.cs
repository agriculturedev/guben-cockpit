using Shared.Domain;

namespace Domain.Events.repository;

public interface IEventRepository : IRepository<Event, Guid>
{
  Task<Event?> GetIncludingUnpublished(Guid id);
  IEnumerable<Event> GetAllIncludingUnpublished();
  IEnumerable<Event> GetAllByIdsIncludingUnpublished(IList<Guid> ids);
  Task<Event?> GetByEventIdAndTerminId(string eventId, string terminId);
  Task<Event?> GetByEventIdAndTerminIdIncludingUnpublished(string eventId, string terminId);

  IEnumerable<Event> GetAllEvents();
  Task<PagedResult<Event>> GetAllEventsPaged(PagedCriteria pagination, EventFilterCriteria filter);
}
