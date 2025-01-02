using Shared.Domain;

namespace Domain.Events.repository;

public interface IEventRepository : IRepository<Event, int>
{
  IEnumerable<Event> GetAllEvents();
}
