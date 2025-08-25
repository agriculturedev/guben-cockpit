using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using Api.Options;
using Microsoft.Extensions.Options;

namespace Api.Services.Masterportal;

public sealed class MasterportalServicesWriter : IMasterportalServicesWriter
{
    private readonly string _path;
    private static readonly SemaphoreSlim _lock = new(1, 1);

    public MasterportalServicesWriter(IOptions<MasterportalOptions> opts)
    {
        _path = opts.Value.ServicesPath;
        if (string.IsNullOrWhiteSpace(_path))
            throw new InvalidOperationException("Masterportal.ServicesPath is not configured.");
    }

    public async Task AppendAsync(JsonNode layer, CancellationToken ct)
    {
        var dir = Path.GetDirectoryName(_path)!;
        Directory.CreateDirectory(dir);

        await _lock.WaitAsync(ct);
        try
        {
            JsonArray arr;
            if (File.Exists(_path))
            {
                var json = await File.ReadAllTextAsync(_path, Encoding.UTF8, ct);
                var parsed = string.IsNullOrWhiteSpace(json) ? new JsonArray() : JsonNode.Parse(json);
                arr = parsed as JsonArray ?? throw new InvalidOperationException("services-internet.json is not a JSON array.");
            }
            else
            {
                arr = new JsonArray();
            }

            if (layer is JsonObject o && o.TryGetPropertyValue("id", out var idNode))
            {
                var id = idNode?.GetValue<string>();
                if (!string.IsNullOrWhiteSpace(id))
                {
                    var exists = arr.Any(n => n is JsonObject x &&
                                              x.TryGetPropertyValue("id", out var xid) &&
                                              xid?.GetValue<string>() == id);
                    if (exists) return;
                }
            }

            arr.Add(layer);

            var tmp = _path + ".tmp";
            var bak = _path + "." + DateTime.UtcNow.ToString("yyyyMMddHHmmss") + ".bak";
            var opts = new JsonSerializerOptions { WriteIndented = true };

            await File.WriteAllTextAsync(tmp, arr.ToJsonString(opts), Encoding.UTF8, ct);

            if (File.Exists(_path))
                File.Replace(tmp, _path, bak);
            else
                File.Move(tmp, _path);
        }
        finally
        {
            _lock.Release();
        }
    }
}
