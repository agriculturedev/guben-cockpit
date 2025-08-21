using System.Net.Mime;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Api.Options;

namespace Api.Controllers.Masterportal;

/// <summary>
/// Endpoints to read/update Masterportal's services-internet.json
/// </summary>
[ApiController]
[Route("masterportal")]
[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
public class MasterportalController : ControllerBase
{
    private static readonly SemaphoreSlim _fileLock = new(1, 1);
    private readonly string _servicesPath;

    public MasterportalController(IOptions<MasterportalOptions> options)
    {
        _servicesPath = options.Value.ServicesPath;
    }

    [HttpGet("services")]
    [EndpointName("MasterportalGetServices")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IResult GetServices()
    {
        if (string.IsNullOrWhiteSpace(_servicesPath) || !System.IO.File.Exists(_servicesPath))
            return Results.NotFound(new { error = "services-internet.json not found", path = _servicesPath });

        return Results.File(_servicesPath, MediaTypeNames.Application.Json);
    }
  
  [HttpPatch("services")]
  [EndpointName("MasterportalAppendService")]
  [ProducesResponseType(StatusCodes.Status204NoContent)]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IResult> AppendService([FromBody] JsonElement newLayer)
  {
    if (string.IsNullOrWhiteSpace(_servicesPath))
      return Results.BadRequest(new { error = "Masterportal.ServicesPath is not configured" });

    var dir = Path.GetDirectoryName(_servicesPath);
    if (string.IsNullOrWhiteSpace(dir))
      return Results.BadRequest(new { error = "Invalid path for services-internet.json", path = _servicesPath });

    Directory.CreateDirectory(dir);

    await _fileLock.WaitAsync();
    try
    {
      JsonArray array;
      if (System.IO.File.Exists(_servicesPath))
      {
        var json = await System.IO.File.ReadAllTextAsync(_servicesPath, Encoding.UTF8);
        if (string.IsNullOrWhiteSpace(json))
          array = new JsonArray();
        else
        {
          var parsed = JsonNode.Parse(json);
          if (parsed is not JsonArray parsedArray)
            return Results.BadRequest(new { error = "services-internet.json is not a JSON array" });
          array = parsedArray;
        }
      }
      else
      {
        array = new JsonArray();
      }

      if (newLayer.ValueKind == JsonValueKind.Object &&
          newLayer.TryGetProperty("id", out var idProp) &&
          idProp.ValueKind == JsonValueKind.String)
      {
        var incomingId = idProp.GetString();
        var duplicate = array.Any(n =>
          n is JsonObject o &&
          o.TryGetPropertyValue("id", out var existingIdNode) &&
          existingIdNode?.GetValue<string>() == incomingId);

        if (duplicate)
          return Results.BadRequest(new { error = "A layer with the same id already exists", id = incomingId });
      }

      var nodeToAdd = JsonNode.Parse(newLayer.GetRawText());
      array.Add(nodeToAdd);

      var tmp = _servicesPath + ".tmp";
      var bak = _servicesPath + "." + DateTime.UtcNow.ToString("yyyyMMddHHmmss") + ".bak";

      var options = new JsonSerializerOptions { WriteIndented = true };
      await System.IO.File.WriteAllTextAsync(tmp, array.ToJsonString(options), Encoding.UTF8);

      if (System.IO.File.Exists(_servicesPath))
        System.IO.File.Replace(tmp, _servicesPath, bak);
      else
        System.IO.File.Move(tmp, _servicesPath);

      return Results.NoContent();
    }
    finally
    {
      _fileLock.Release();
    }
  }
}
