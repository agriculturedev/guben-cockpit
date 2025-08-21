using Domain.Events;
using Shared.Domain;

namespace Domain.Booking.repository;

public interface IBookingRepository : IRepository<Booking, Guid>
{
  Task<List<Booking>> GetAllTenants();
}