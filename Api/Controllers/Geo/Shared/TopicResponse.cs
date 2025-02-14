using Domain.Topic;

namespace Api.Controllers.Geo.Shared;

public class TopicResponse
{
  public required string Id { get; set; }
  public required string Name { get; set; }
  public required IEnumerable<DataSourceResponse> DataSources { get; set; }

  public static TopicResponse Map(Topic topic)
  {
    return new TopicResponse()
    {
      Id = topic.Id,
      Name = topic.Name,
      DataSources = topic.DataSources.Select(DataSourceResponse.Map)
    };
  }
}

public class DataSourceResponse
{
  public required string Id { get; set; }
  public required string Name { get; set; }
  public SourceResponse? Wms { get; set; }
  public SourceResponse? Wfs { get; set; }

  public static DataSourceResponse Map(DataSource source)
  {
    return new DataSourceResponse()
    {
      Id = source.Id,
      Name = source.Name,
      Wms = source.Wms is not null ? SourceResponse.Map(source.Wms) : null,
      Wfs = source.Wfs is not null ? SourceResponse.Map(source.Wfs) : null
    };
  }
}

public class SourceResponse
{
  public required string Name { get; set; }
  public required string Url { get; set; }

  public static SourceResponse Map(Source source)
  {
    return new SourceResponse()
    {
      Name = source.Name,
      Url = source.Url
    };
  }
}
