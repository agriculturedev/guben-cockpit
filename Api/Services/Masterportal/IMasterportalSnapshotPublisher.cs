namespace Api.Services.Masterportal;

public interface IMasterportalSnapshotPublisher
{
    /// <summary>
    /// Rebuild services-internet.json and config.json from the current set of APPROVED links
    /// and upload to Nextcloud.
    /// </summary>
    Task PublishAsync(CancellationToken cancellationToken = default);
}