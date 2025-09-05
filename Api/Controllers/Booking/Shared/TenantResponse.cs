using Domain.Booking;

namespace Api.Controllers.Bookings.Shared;

public struct TenantResponse
{
	public required Guid Id { get; set; }
	public required string TenantId { get; set; }
	public bool? ForPublicUse { get; set; }

	public static TenantResponse Map(Booking booking)
	{
		return new TenantResponse()
		{
			Id = booking.Id,
			TenantId = booking.TenantId,
			ForPublicUse = booking.ForPublicUse,
		};
	}
}