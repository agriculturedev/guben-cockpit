using Shared.Domain;

namespace Domain.Events.repository;

public interface IEventRepository : IRepository<Event, int>
{
  IEnumerable<Event> GetAllEvents();
  Task<PagedResult<Event>> GetAllEventsPaged(PagedCriteria pagination, EventFilterCriteria filter);
}
