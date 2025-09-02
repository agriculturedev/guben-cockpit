using Shared.Api;

namespace Api.Controllers.Geo.ValidateGeoDataSource;

public class ValidateGeoDataSourceQuery : IApiRequest<ValidateGeoDataSourceResponse>
{
  public required Guid Id { get; set; }
  public required bool IsValid { get; set; }
}

public class ValidateRequest
{
  public bool IsValid { get; set; }
}