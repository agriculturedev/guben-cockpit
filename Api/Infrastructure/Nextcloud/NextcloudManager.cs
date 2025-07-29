using System.Net;
using WebDav;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;

namespace Api.Infrastructure.Nextcloud
{
  public interface IFileManager
  {
    public abstract Task<IList<WebDavResource>> GetFilesAsync(string rootPath);
    public abstract Task<byte[]> GetFileAsync(string filename);
    public abstract Task CreateFileAsync(byte[] fileContents, string path);
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

  public class NextcloudManager : IFileManager
  {
    public const string ImagesDirectory = "Images";

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

      //Everything but the Geo stuff is currently saved under Guben/Images/...
      //Should be either send by the frontend or moved into its own Controller, so BaseDirectory is just Guben...
      _baseFolder = config.BaseDirectory + ImagesDirectory;
    }

    public async Task<IList<WebDavResource>> GetFilesAsync(string rootPath)
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
          if ((int)result.StatusCode == 404 || (int)result.StatusCode == 403)
          {
              return new List<WebDavResource>();
          }
          throw new Exception($"Failed to get directory contents: {result.StatusCode}");
      }

      return result.Resources
          .Where(entry => !string.IsNullOrEmpty(entry.ContentType) && entry.ContentType != "httpd/unix-directory")
          .ToList();
    }

    public async Task<byte[]> GetFileAsync(string filename)
    {
      var path = $"{_baseFolder}/{filename}";
      var result = await _client.GetRawFile(path);

      if (!result.IsSuccessful)
      {
        throw new Exception($"Failed to get file: {result.StatusCode}");
      }

      return result.Stream != null ? await ReadStreamAsync(result.Stream) : throw new Exception("File stream is null");
    }

    public async Task<byte[]> GetImageAsync(string filename)
    {
      var path = $"{_baseFolder}/{filename}";
      var result = await _client.GetRawFile(path);

      if (!result.IsSuccessful)
      {
        throw new Exception($"Failed to get file: {result.StatusCode}");
      }

      return result.Stream != null ? await ReadStreamAsync(result.Stream) : throw new Exception("File stream is null");
    }

    public async Task<bool> DeleteFileAsync(string filePath)
    {
      var fullPath = $"{_baseFolder}/{filePath}";
      var result = await _client.Delete(fullPath);
      return result.IsSuccessful;
    }

    //deletes everything from Guben/Images/e.g. School
    public async Task<bool> DeleteProjectFolderAsync(string projectId, string type)
    {
      var fullPath = $"{_baseFolder}/{type}/{projectId}";
      try
      {
        var propfindResult = await _client.Propfind(fullPath);
        if (propfindResult?.IsSuccessful != true || propfindResult.Resources == null || propfindResult.Resources.Count == 0)
        {
          return true;
        }
        var deleteResult = await _client.Delete(fullPath);
        return deleteResult?.IsSuccessful == true;
      }
      catch
      {
        return false;
      }
    }

    public async Task CreateFileAsync(byte[] fileContents, string path, string extension)
    {
      var filePath = $"{_baseFolder}/{path}";
      var adjustedDirectory = Path.GetDirectoryName(filePath)?.Replace("\\", "/");

      if (!string.IsNullOrEmpty(adjustedDirectory) && adjustedDirectory != _baseFolder) // MAKE SURE BASEFOLDER EXISTS IN NEXTCLOUD!
      {
        var relativeDir = adjustedDirectory.Substring(_baseFolder.Length).TrimStart('/');
        await EnsureDirectoryExists(relativeDir);
      }

      byte[] processedContents;
      try
      {
        processedContents = CompressImage(fileContents, extension);
      }
      catch (NotSupportedException)
      {
        processedContents = fileContents;
      }

      using (var ms = new MemoryStream(processedContents))
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

    private async Task EnsureDirectoryExists(string directory)
    {
      var parts = directory.Split('/', StringSplitOptions.RemoveEmptyEntries);
      string current = "";
      foreach (var part in parts)
      {
        current = string.IsNullOrEmpty(current) ? part : $"{current}/{part}";
        var mkDirResult = await _client.Mkcol($"{_baseFolder}/{current}");
        if (!mkDirResult.IsSuccessful && mkDirResult.StatusCode != (int)HttpStatusCode.MethodNotAllowed)
        {
          throw new Exception($"Failed to create directory: {mkDirResult.StatusCode}");
        }
      }
    }

    private static byte[] CompressImage(byte[] imageBytes, string extension)
    {
      using var inputStream = new MemoryStream(imageBytes);
      try
      {
        using var image = Image.Load(inputStream);
        var outputStream = new MemoryStream();

        if (extension.Equals(".jpg", StringComparison.OrdinalIgnoreCase) || extension.Equals(".jpeg", StringComparison.OrdinalIgnoreCase))
        {
          var encoder = new JpegEncoder { Quality = 75 };
          image.Save(outputStream, encoder);
        }
        else if (extension.Equals(".png", StringComparison.OrdinalIgnoreCase))
        {
          var encoder = new PngEncoder { CompressionLevel = PngCompressionLevel.DefaultCompression };
          image.Save(outputStream, encoder);
        }
        else
        {
          throw new NotSupportedException("Only .jpg and .png formats are supported for compression.");
        }

        return outputStream.ToArray();
      }
      catch (UnknownImageFormatException)
      {
        throw new NotSupportedException("File format not supported for compression.");
      }
    }
  }
}
