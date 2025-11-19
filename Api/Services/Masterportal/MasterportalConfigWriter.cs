using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Nodes;
using Api.Infrastructure.Nextcloud;
using Api.Options;
using Microsoft.Extensions.Options;

namespace Api.Services.Masterportal;

public sealed class MasterportalConfigWriter : IMasterportalConfigWriter
{
  private readonly NextcloudManager _nextcloudManager;
  private readonly string _configPath;
  private readonly string _folderTitle;
  private readonly string _themenSection;
  private static readonly SemaphoreSlim _lock = new(1, 1);

  public MasterportalConfigWriter(
    NextcloudManager nextcloudManager,
    IOptions<MasterportalOptions> opts
  )
  {
    _nextcloudManager = nextcloudManager;

    _configPath = opts.Value.ConfigPath;
    _folderTitle = string.IsNullOrWhiteSpace(opts.Value.UploadedFolderTitle) ? "Uploaded_Geodata" : opts.Value.UploadedFolderTitle;
    _themenSection = string.IsNullOrWhiteSpace(opts.Value.ThemeConfigSection) ? "Fachdaten" : opts.Value.ThemeConfigSection;

    if (string.IsNullOrWhiteSpace(_configPath))
      throw new InvalidOperationException("Masterportal.ConfigPath is not configured.");
  }

  public async Task EnsureFolderAndAddLayerAsync(string layerId, CancellationToken ct)
  {
    if (string.IsNullOrWhiteSpace(layerId))
      return;

    Directory.CreateDirectory(Path.GetDirectoryName(_configPath)!);

    await _lock.WaitAsync(ct);
    try
    {
      JsonObject root;
      if (File.Exists(_configPath))
      {
        var text = await File.ReadAllTextAsync(_configPath, Encoding.UTF8, ct);
        var parsed = JsonNode.Parse(text);
        root = parsed as JsonObject ?? throw new InvalidOperationException("config.json root is not an object.");
      }
      else
      {
        root = new JsonObject
        {
          ["Portalconfig"] = new JsonObject(),
          ["Themenconfig"] = new JsonObject()
        };
      }

      var themen = root["Themenconfig"] as JsonObject
                   ?? (JsonObject)(root["Themenconfig"] = new JsonObject());

      var section = themen[_themenSection] as JsonObject;
      if (section is null)
      {
        section = new JsonObject
        {
          ["Layer"] = new JsonArray(),
          ["Ordner"] = new JsonArray()
        };
        themen[_themenSection] = section;
      }

      var ordner = section["Ordner"] as JsonArray;
      if (ordner is null)
      {
        ordner = new JsonArray();
        section["Ordner"] = ordner;
      }

      JsonObject? folder = null;
      foreach (var n in ordner)
      {
        if (n is JsonObject o &&
            o.TryGetPropertyValue("Titel", out var t) &&
            string.Equals(t?.GetValue<string>(), _folderTitle, StringComparison.OrdinalIgnoreCase))
        {
          folder = o;
          break;
        }
      }

      if (folder is null)
      {
        folder = new JsonObject
        {
          ["Layer"] = new JsonArray(),
          ["Ordner"] = new JsonArray(),
          ["Titel"] = _folderTitle,
          ["isFolderSelectable"] = true
        };
        ordner.Add(folder);
      }

      var layerArr = folder["Layer"] as JsonArray ?? (JsonArray)(folder["Layer"] = new JsonArray());

      var exists = layerArr.Any(x => x is JsonObject jo
                                   && jo.TryGetPropertyValue("id", out var id)
                                   && string.Equals(id?.GetValue<string>(), layerId, StringComparison.OrdinalIgnoreCase));
      if (!exists)
      {
        layerArr.Add(new JsonObject { ["id"] = layerId });
      }

      var tmp = _configPath + ".tmp";
      var bak = _configPath + "." + DateTime.UtcNow.ToString("yyyyMMddHHmmss") + ".bak";
      var opts = new JsonSerializerOptions
      {
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
        WriteIndented = true
      };

      await File.WriteAllTextAsync(tmp, root.ToJsonString(opts), Encoding.UTF8, ct);

      if (File.Exists(_configPath))
        File.Replace(tmp, _configPath, bak);
      else
        File.Move(tmp, _configPath);
    }
    finally
    {
      _lock.Release();
    }
  }

  public async Task WriteFreshAsync(IEnumerable<string> layerIds, CancellationToken ct)
  {
    var ids = layerIds?.Where(s => !string.IsNullOrWhiteSpace(s))
      .Distinct(StringComparer.OrdinalIgnoreCase)
      .ToList() ?? new List<string>();

    await _lock.WaitAsync(ct);
    try
    {
      var root = new JsonObject
      {
        ["Portalconfig"] = new JsonObject(),
        ["Themenconfig"] = new JsonObject()
      };

      var themen = new JsonObject();
      root["Themenconfig"] = themen;

      var section = new JsonObject
      {
        ["Layer"] = new JsonArray(),
        ["Ordner"] = new JsonArray()
      };
      themen[_themenSection] = section;

      var ordner = new JsonArray();
      section["Ordner"] = ordner;

      var folder = new JsonObject
      {
        ["Layer"] = new JsonArray(),
        ["Ordner"] = new JsonArray(),
        ["Titel"] = _folderTitle,
        ["isFolderSelectable"] = true
      };
      ordner.Add(folder);

      var layerArr = (JsonArray)folder["Layer"]!;
      foreach (var id in ids)
        layerArr.Add(new JsonObject { ["id"] = id });

      var opts = new JsonSerializerOptions
      {
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
        WriteIndented = true
      };

      var json = root.ToJsonString(opts);
      var bytes = Encoding.UTF8.GetBytes(json);

      // Backup
      try
      {
        var existing = await _nextcloudManager.GetFileAsync(_configPath);
        if (existing is { Length: > 0 })
        {
          var ts = DateTime.UtcNow.ToString("yyyyMMdd-HHmmss");
          var backupPath = $"config/backups/config.json.{ts}.bak";
          await _nextcloudManager.CreateFileAsync(existing, backupPath);
        }
      }
      catch { }

      await _nextcloudManager.CreateFileAsync(bytes, _configPath);
    }
    finally
    {
      _lock.Release();
    }
  }
}
