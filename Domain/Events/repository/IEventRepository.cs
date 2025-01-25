using Shared.Domain;

namespace Domain.Events.repository;

public interface IEventRepository : IRepository<Event, Guid>
{
  Task<Event?> GetByEventIdAndTerminId(string eventId, string terminId);
  IEnumerable<Event> GetAllEvents();
  Task<PagedResult<Event>> GetAllEventsPaged(PagedCriteria pagination, EventFilterCriteria filter);
}
