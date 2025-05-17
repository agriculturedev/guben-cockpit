using System.Net.Mime;
using Api.Infrastructure.Nextcloud;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.Nextcloud;

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
    if (file == null || file.Length == 0)
      return BadRequest("No file content provided.");

    if (string.IsNullOrWhiteSpace(filename))
      return BadRequest("filename is required");

    var extension = Path.GetExtension(file.FileName);

    using var ms = new MemoryStream();
    await file.CopyToAsync(ms);
    await _nextcloudManager.CreateFileAsync(ms.ToArray(), filename, extension);
    return Ok();
  }
}
