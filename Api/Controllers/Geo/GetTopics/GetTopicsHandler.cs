using Api.Controllers.Geo.Shared;
using Domain.Topic.repository;
using Shared.Api;
using System.Text.Json;

namespace Api.Controllers.Geo.GetTopics;

public class GetTopicsHandler : ApiRequestHandler<GetTopicsQuery, GetTopicsResponse>
{
  private readonly ITopicRepository _topicRepository;
  private readonly TopicConfiguration _topicConfig;

  public GetTopicsHandler(ITopicRepository topicRepository, TopicConfiguration topicConfig)
  {
    _topicRepository = topicRepository;
    _topicConfig = topicConfig;
  }


  public override async Task<GetTopicsResponse> Handle(GetTopicsQuery request, CancellationToken cancellationToken)
  {
    var topics = await GetTopicsFromConfig();

    // add the Topics from our DB
    // will add this when the Geoupload Stuff is finished
    // or we have setup the new Datescheme Resi-form needs

    return new GetTopicsResponse
    {
      Topics = topics
    };
  }

  public async Task<List<TopicResponse>> GetTopicsFromConfig()
  {
    var basePath = Path.GetFullPath(_topicConfig.Directory);
    var configJsonPath = Path.Combine(basePath, "config.json");
    var servicesJsonPath = Path.Combine(basePath, "resources", "services-internet.json");

    if (!File.Exists(configJsonPath) || !File.Exists(servicesJsonPath))
      throw new FileNotFoundException("Required config files not found");

    var configJson = await File.ReadAllTextAsync(configJsonPath);
    var servicesJson = await File.ReadAllTextAsync(servicesJsonPath);

    var configDoc = JsonDocument.Parse(configJson);
    var servicesDoc = JsonDocument.Parse(servicesJson);

    var servicesMap = servicesDoc.RootElement
        .EnumerateArray()
        .GroupBy(s => s.GetProperty("id").GetString())
        .ToDictionary(g => g.Key!, g => g.ToList());

    var topics = new List<TopicResponse>();

    var folders = configDoc.RootElement
        .GetProperty("Themenconfig")
        .GetProperty("Fachdaten")
        .GetProperty("Ordner");

    foreach (var folder in folders.EnumerateArray())
    {
      string folderTitle = folder.GetProperty("Titel").GetString() ?? "Unbenannt";
      string topicId = Guid.NewGuid().ToString();

      var dataSources = new List<DataSourceResponse>();

      foreach (var layer in folder.GetProperty("Layer").EnumerateArray())
      {
        var id = layer.GetProperty("id").GetString();
        if (id == null || !servicesMap.TryGetValue(id, out var matchingServices))
          continue;

        foreach (var service in matchingServices)
        {
          var name = service.GetProperty("name").GetString() ?? "Unnamed Layer";
          var url = service.GetProperty("url").GetString() ?? "";
          var type = service.GetProperty("typ").GetString() ?? "";
          var version = service.TryGetProperty("version", out var vProp) ? vProp.GetString() ?? "" : "";
          var layerName = service.TryGetProperty("layers", out var layersProp)
              ? layersProp.GetString() ?? ""
              : "";

          dataSources.Add(new DataSourceResponse
          {
            Id = id,
            Name = name,
            Version = version,
            Sources = new List<SourceResponse>
              {
                new SourceResponse
                {
                  LayerName = layerName,
                  Url = url,
                  Type = type
                }
              }
          });
        }
      }

      if (dataSources.Any())
      {
        topics.Add(new TopicResponse
        {
          Id = topicId,
          Name = folderTitle,
          DataSources = dataSources
        });
      }
    }

    return topics;
  }
}
