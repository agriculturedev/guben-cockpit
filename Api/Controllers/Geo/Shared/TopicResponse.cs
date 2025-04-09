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
  public required IEnumerable<SourceResponse> Sources { get; set; }

  public static DataSourceResponse Map(DataSource dataSource)
  {
    return new DataSourceResponse()
    {
      Id = dataSource.Id,
      Name = dataSource.Name,
      Sources = dataSource.Sources.Select(SourceResponse.Map)
    };
  }
}

public class SourceResponse
{
  public required string Name { get; set; }
  public required string Url { get; set; }
  public required string Type { get; set; }

  public static SourceResponse Map(Source source)
  {
    return new SourceResponse()
    {
      Name = source.Name,
      Url = source.Url,
      Type = source.Type.Name
    };
  }
}
