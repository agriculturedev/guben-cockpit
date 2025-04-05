using Shared.Api;

namespace Api.Controllers.Locations.Createlocation;

public class CreateLocationQuery : IApiRequest<CreateLocationResponse>
{
  public required string Name { get; set; }
  public string? City { get; set; }
  public string? Street { get; set; }
  public string? TelephoneNumber { get; set; }
  public string? Fax { get; set; }
  public string? Email { get; set; }
  public string? Website { get; set; }
  public string? Zip { get; set; }
}
