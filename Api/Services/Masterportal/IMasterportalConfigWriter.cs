namespace Api.Services.Masterportal;

public interface IMasterportalConfigWriter
{
    Task EnsureFolderAndAddLayerAsync(string layerId, CancellationToken ct);
}