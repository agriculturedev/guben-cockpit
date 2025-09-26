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

  [HttpGet("preview")]
  [EndpointName("NextcloudPreview")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(FileContentResult))]
  public async Task<IActionResult> GetPreview([FromQuery] string pathToImage = "")
  {
    if (string.IsNullOrWhiteSpace(pathToImage))
      return BadRequest("pathToImage cannot be empty.");

    var previewFile = await _nextcloudManager.GetPreview(pathToImage);
    return File(previewFile, "image/png");
  }

  [HttpGet("files")]
  [EndpointName("NextcloudGetFiles")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IList<string>))]
  public async Task<IActionResult> GetFiles([FromQuery] string? directory = "", [FromQuery] string? path = "")
  {
    string fullPath = string.IsNullOrWhiteSpace(directory) ? (path ?? "") : $"{NextcloudManager.ImagesDirectory}/{directory}/{path}";

    var files = await _nextcloudManager.GetFilesAsync(fullPath ?? "");
    return Ok(files.Select(f => Path.GetFileName(f.Uri)));
  }


  [HttpGet("images")]
  [EndpointName("NextcloudGetImages")]
  [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<FilesResponse>))]
  public async Task<IActionResult> GetImages([FromQuery] string? directory = "", [FromQuery] string? path = "")
  {
    string fullPath = string.IsNullOrWhiteSpace(directory) ? (path ?? "") : $"{NextcloudManager.ImagesDirectory}/{directory}/{path}";

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
    string fullPath;
    if (filename.Contains("remote.php/webdav", StringComparison.OrdinalIgnoreCase))
    {
      fullPath = filename;
    }
    else
    {

      var basePath = string.IsNullOrWhiteSpace(directory)
            ? $"{NextcloudManager.ImagesDirectory}"
            : $"{NextcloudManager.ImagesDirectory}/{directory}";

      fullPath = $"{basePath}/{filename}";
    }
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
      string path = $"{NextcloudManager.ImagesDirectory}/{filename}";
      var fileBytes = await _nextcloudManager.GetFileAsync(path);
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
    var path = $"{NextcloudManager.ImagesDirectory}/{directory}/{filename}";
    await _nextcloudManager.CreateFileAsync(ms.ToArray(), path, extension);
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

    var fullPath = $"{NextcloudManager.ImagesDirectory}/{directory}/{filename}";

    var success = await _nextcloudManager.DeleteFileAsync(fullPath);
    if (!success) return NotFound();
    return Ok();
  }
}
