using Database;
using Domain.Booking;
using Domain.Booking.repository;
using Microsoft.EntityFrameworkCore;
using Shared.Database;

namespace Database.Repositories;

public class BookingRepository
	: EntityFrameworkRepository<Booking, Guid, GubenDbContext>, IBookingRepository
{
	public BookingRepository(ICustomDbContextFactory<GubenDbContext> dbContextFactory)
		: base(dbContextFactory)
	{
	}

	public Task<List<Booking>> GetAllTenants()
	{
		return Set
			.AsNoTracking()
			.TagWith(nameof(BookingRepository) + "." + nameof(GetAllTenants))
			.ToListAsync();
	}
}