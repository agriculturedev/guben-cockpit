using System.Net;
using WebDav;

namespace Api.Infrastructure.Nextcloud
{
  public abstract class FileManager
  {
    public abstract Task<IList<WebDavResource>> GetFilesAsync(string rootPath);
    public abstract Task<byte[]> GetFileAsync(string filename);
    public abstract Task CreateFileAsync(byte[] fileContents, string fileName, string extension);
  }

  public static class NextCloudInstaller
  {
    public static IServiceCollection AddNextCloud(this IServiceCollection services, NextcloudConfiguration config)
    {
      services.AddSingleton<NextcloudConfiguration>(config);
      services.AddScoped<NextcloudManager>();
      return services;
    }
  }

  public class NextcloudManager : FileManager
  {
    private readonly IWebDavClient _client;
    private readonly string _baseFolder;

    public NextcloudManager(NextcloudConfiguration config)
    {
      var clientParams = new WebDavClientParams
      {
        BaseAddress = new Uri($"{config.BaseUri}/remote.php/webdav/"),
        Credentials = new NetworkCredential(config.Username, config.Password)
      };
      _client = new WebDavClient(clientParams);

      _baseFolder = config.BaseDirectory;
    }

    public override async Task<IList<WebDavResource>> GetFilesAsync(string rootPath)
    {
      var path = $"{_baseFolder}/{rootPath}";
      var parameters = new PropfindParameters
      {
          Headers = new List<KeyValuePair<string, string>>
          {
              new ("Depth", "infinity")
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
      var path = $"{_baseFolder}/{filename}";
      var result = await _client.GetRawFile(path);

      if (!result.IsSuccessful)
      {
        throw new Exception($"Failed to get file: {result.StatusCode}");
      }

       return result.Stream != null ? await ReadStreamAsync(result.Stream) : throw new Exception("File stream is null");
    }

    public override async Task CreateFileAsync(byte[] fileContents, string fileName, string extension)
    {
      var filePath = $"{_baseFolder}/{fileName}{extension}";
      var directory = Path.GetDirectoryName(filePath)?.Replace("\\", "/");

      if (!string.IsNullOrEmpty(directory) && directory != _baseFolder)
      {
          var mkDirResult = await _client.Mkcol(directory);
          if (!mkDirResult.IsSuccessful && mkDirResult.StatusCode != (int)HttpStatusCode.MethodNotAllowed)
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
