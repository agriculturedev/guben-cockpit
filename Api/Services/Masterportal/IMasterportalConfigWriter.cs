namespace Api.Services.Masterportal;

public interface IMasterportalConfigWriter
{
    Task EnsureFolderAndAddLayerAsync(string layerId, CancellationToken ct);

    /// <summary>
    /// Writes a brand-new config.json to a generated output path (not the original ConfigPath).
    /// Does not read or merge the existing file.
    /// </summary>
    Task WriteFreshAsync(IEnumerable<string> layerIds, CancellationToken ct);
}