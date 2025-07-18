using System.Net.Mime;
using Api.Controllers.Nextcloud.Shared;
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
  [EndpointName("NextcloudGetFiles")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IList<string>))]
  public async Task<IActionResult> GetFiles([FromQuery] string? directory = "", [FromQuery] string? path = "")
  {
    string fullPath = string.IsNullOrWhiteSpace(directory) ? (path ?? "") : $"{directory}/{path}";

    var files = await _nextcloudManager.GetFilesAsync(fullPath ?? "");
    return Ok(files.Select(f => Path.GetFileName(f.Uri)));
  }


  [HttpGet("images")]
  [EndpointName("NextcloudGetImages")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<FilesResponse>))]
  public async Task<IActionResult> GetImages([FromQuery] string? directory = "", [FromQuery] string? path = "")
  {
    string fullPath = string.IsNullOrWhiteSpace(directory) ? (path ?? "") : $"{directory}/{path}";

    var files = await _nextcloudManager.GetFilesAsync(fullPath);

    // Filter the files to only include recognized image types (by extension)
    var imageFiles = files.Where(file =>
      file.ContentType != null &&
      file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase));

    // Compose URLs for the React frontend
    var imageInfoList = imageFiles.Select(file => new FilesResponse()
    {
      Filename = file.Uri.Split(Path.DirectorySeparatorChar).Last(),
      Url = Url.Action(
        action: "GetImage",
        controller: "Nextcloud",
        values: new { filename = $"{file.Uri.Split(Path.DirectorySeparatorChar).Last()}", directory = $"{directory}" }
      ),
      ContentType = file.ContentType
    });

    return Ok(imageInfoList);
  }

  [HttpGet("image")]
  [EndpointName("NextcloudGetImage")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(FileContentResult))]
  public async Task<IActionResult> GetImage([FromQuery] string filename, [FromQuery] string? directory = "")
  {
    string fullPath = string.IsNullOrWhiteSpace(directory) ? filename : $"{directory}/{filename}";
    var fileBytes = await _nextcloudManager.GetFileAsync(fullPath);
    return File(fileBytes, MimeHelper.GetMimeTypeForFile(filename), filename);
  }

  [HttpGet]
  [EndpointName("NextcloudGetFile")]
  [Produces(MediaTypeNames.Application.Octet)]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(FileContentResult))]
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
  [EndpointName("NextcloudCreateFile")]
  [Authorize]
  [Consumes("multipart/form-data")]
  public async Task<IActionResult> CreateFile([FromQuery] string filename, [FromQuery] string directory, IFormFile file)
  {
    if (file == null || file.Length == 0)
      return BadRequest("No file content provided.");

    if (string.IsNullOrWhiteSpace(filename))
      return BadRequest("filename is required");

    if (string.IsNullOrWhiteSpace(directory))
      return BadRequest("tabId is required");

    var extension = Path.GetExtension(file.FileName);

    using var ms = new MemoryStream();
    await file.CopyToAsync(ms);
    await _nextcloudManager.CreateFileAsync(ms.ToArray(), filename, extension, directory);
    return Ok();
  }

  [HttpDelete]
  [EndpointName("NextcloudDeleteFile")]
  [Authorize]
  public async Task<IActionResult> DeleteFile([FromQuery] string filename, [FromQuery] string directory)
  {
    if (string.IsNullOrWhiteSpace(filename))
      return BadRequest("filename is required");

    if (string.IsNullOrWhiteSpace(directory))
      return BadRequest("directory is required");

    var fullPath = $"{directory}/{filename}";

    var success = await _nextcloudManager.DeleteFileAsync(fullPath);
    if (!success) return NotFound();
    return Ok();
  }
}
