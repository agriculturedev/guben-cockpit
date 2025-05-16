using Api;
using WebDav;

namespace Shared.Api.Nextcloud
{
  public abstract class FileManager
  {
    public abstract Task<IList<WebDavResource>> GetFilesAsync(string rootPath);
    public abstract Task<byte[]> GetFileAsync(string filename);
    public abstract Task CreateFileAsync(byte[] fileContents, string fileName);
  }

  public class NextcloudManager : FileManager
  {
    private readonly IWebDavClient _client;
    private const string BaseFolder = "Guben/Images";

    public NextcloudManager(NextcloudConfiguration config)
    {
      var clientParams = new WebDavClientParams
      {
        BaseAddress = new Uri($"{config.BaseUri}/remote.php/webdav/"),
        Credentials = new System.Net.NetworkCredential(config.Username, config.Password)
      };
      _client = new WebDavClient(clientParams);
    }

    public override async Task<IList<WebDavResource>> GetFilesAsync(string rootPath)
    {
      var path = $"{BaseFolder}/{rootPath}";
      var parameters = new PropfindParameters
      {
          Headers = new List<KeyValuePair<string, string>>
          {
              new KeyValuePair<string, string>("Depth", "infinity")
          }
      };

      var result = await _client.Propfind(path, parameters);

      if (!result.IsSuccessful)
      {
        throw new Exception($"Failed to get directory contents: {result.StatusCode}");
      }

      return result.Resources
          .Where(entry => entry.ContentType != "httpd/unix-directory")
          .ToList();
    }

    public override async Task<byte[]> GetFileAsync(string filename)
    {
      var path = $"{BaseFolder}/{filename}";
      var result = await _client.GetRawFile(path);

      if (!result.IsSuccessful)
      {
        throw new Exception($"Failed to get file: {result.StatusCode}");
      }

       return result.Stream != null ? await ReadStreamAsync(result.Stream) : throw new Exception("File stream is null");
    }

    public override async Task CreateFileAsync(byte[] fileContents, string fileName)
    {
      var filePath = $"{BaseFolder}/{fileName}";
      var directory = Path.GetDirectoryName(filePath)?.Replace("\\", "/");

      if (!string.IsNullOrEmpty(directory) && directory != BaseFolder)
      {
          var mkDirResult = await _client.Mkcol(directory);
          if (!mkDirResult.IsSuccessful && mkDirResult.StatusCode != (int)System.Net.HttpStatusCode.MethodNotAllowed)
          {
              throw new Exception($"Failed to create directory: {mkDirResult.StatusCode}");
          }
      }

      using (var ms = new MemoryStream(fileContents))
      {
        var putResult = await _client.PutFile(filePath, ms);
        if (!putResult.IsSuccessful)
        {
            throw new Exception($"Failed to upload file: {putResult.StatusCode}");
        }
      }
    }

    private static async Task<byte[]> ReadStreamAsync(Stream stream)
    {
      using var ms = new MemoryStream();
      await stream.CopyToAsync(ms);
      return ms.ToArray();
    }
  }
}