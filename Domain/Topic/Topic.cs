using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.Topic;

public sealed class Topic : Entity<string>
{
  public string Name { get; set; }

  private readonly List<DataSource> _dataSources = [];
  public IReadOnlyCollection<DataSource> DataSources => _dataSources.AsReadOnly();

  private Topic(string id, string name)
  {
    Id = id;
    Name = name;
  }

  public static Result<Topic> Create(string id, string name)
  {
    return new Topic(id, name);
  }

  public Result AddDataSource(DataSource dataSource)
  {
    _dataSources.Add(dataSource);
    return Result.Ok();
  }
}


public sealed class DataSource : Entity<string>
{
  public string Name { get; set; }
  public Source? Wms { get; set; }
  public Source? Wfs { get; set; }

  private DataSource(string id, string name, Source? wms, Source? wfs)
  {
    Id = id;
    Name = name;
    Wms = wms;
    Wfs = wfs;
  }

  public static Result<DataSource> Create(string id, string name, Source? wms, Source? wfs)
  {
    if (wms is null && wfs is null)
      return Result.Error(TranslationKeys.AtLeastOneLayerSourceIsRequired);

    return new DataSource(id, name, wms, wfs);
  }
}

public sealed class Source
{
  public string Name { get; set; }
  public string Url { get; set; }

  private Source(string name, string url)
  {
    Name = name;
    Url = url;
  }

  public static Result<Source> Create(string name, string url)
  {
    return new Source(name, url);
  }
}
