using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.Booking;

public sealed class Booking : Entity<Guid>
{
	public string TenantId { get; private set; }
	public bool ForPublicUse { get; private set; }

	private Booking(Guid id, string tenantId, bool forPublicUse)
	{
		Id = id;
		TenantId = tenantId;
		ForPublicUse = forPublicUse;
	}

	public static Result<Booking> CreateWithGeneratedId(string tenantId, bool forPublicUse = false)
	{
		return new Booking(
			Guid.CreateVersion7(),
			tenantId,
			forPublicUse
		);
	}

}