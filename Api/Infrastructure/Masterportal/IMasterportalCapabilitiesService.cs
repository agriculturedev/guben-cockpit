using Domain.MasterportalLinks;

public interface IMasterportalCapabilitiesService
{
  /// <summary>
  /// Validates the link against its GetCapabilities and, if valid, enriches the entity.
  /// Throws ProblemDetailsException if the layer/featureType does not exist or response is invalid.
  /// </summary>
  Task ValidateAndEnrichAsync(MasterportalLink link, CancellationToken ct);
}
