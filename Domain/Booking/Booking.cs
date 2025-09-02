using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.Booking;

public sealed class Booking : Entity<Guid>
{
	public string TenantId { get; private set; }

	private Booking(Guid id, string tenantId)
	{
		Id = id;
		TenantId = tenantId;
	}

	public static Result<Booking> CreateWithGeneratedId(string tenantId)
	{
		return new Booking(
			Guid.CreateVersion7(),
			tenantId
		);
	}

}