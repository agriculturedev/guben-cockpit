using System.Text.Json.Nodes;

namespace Api.Services.Masterportal;

public interface IMasterportalServicesWriter
{
    Task AppendAsync(JsonNode layer, CancellationToken ct);
}