using System.Net.Mime;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Api.Nextcloud;

[ApiController]
[Route("nextcloud")]
[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
public class NextcloudController : ControllerBase
{
  private readonly NextcloudManager _nextcloudManager;

  public NextcloudController(NextcloudManager nextcloudManager)
  {
    _nextcloudManager = nextcloudManager;
  }

  [HttpGet("files")]
  [EndpointName("GetFiles")]
  [ProducesResponseType(StatusCodes.Status200OK)]
  public async Task<IActionResult> GetFiles([FromQuery] string? path = "")
  {
    var files = await _nextcloudManager.GetFilesAsync(path ?? "");
    return Ok(files);
  }

  [HttpGet]
  [EndpointName("GetFile")]
  [Produces(MediaTypeNames.Application.Octet)]
  [ProducesResponseType(StatusCodes.Status200OK)]
  [ProducesResponseType(StatusCodes.Status404NotFound)]
  public async Task<IActionResult> GetFile([FromQuery] string filename)
  {
    try
    {
      var fileBytes = await _nextcloudManager.GetFileAsync(filename);
      return File(fileBytes, MediaTypeNames.Application.Octet, filename);
    }
    catch (FileNotFoundException)
    {
      return NotFound();
    }
  }

  [HttpPost]
  [EndpointName("CreateFile")]
  [Authorize]
  [Consumes("multipart/form-data")]
  public async Task<IActionResult> CreateFile([FromQuery] string filename, IFormFile file)
  {
    var keycloakId = User.FindFirst("sub")?.Value;
    if (string.IsNullOrEmpty(keycloakId)) return Unauthorized("User not authenticated.");

    if (file == null || file.Length == 0) return BadRequest("No file content provided.");

    using var ms = new MemoryStream();
    await file.CopyToAsync(ms);
    await _nextcloudManager.CreateFileAsync(ms.ToArray(), filename);
    return Ok();
  }
}