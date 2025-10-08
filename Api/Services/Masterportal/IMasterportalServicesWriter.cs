using System.Text.Json.Nodes;

namespace Api.Services.Masterportal;

public interface IMasterportalServicesWriter
{
    Task AppendAsync(JsonNode layer, CancellationToken ct);

    /// <summary>
    /// Replace the generated services file with the provided array (atomic write).
    /// Does NOT read or merge any existing file.
    /// </summary>
    Task RewriteAsync(JsonArray layers, CancellationToken ct);
}