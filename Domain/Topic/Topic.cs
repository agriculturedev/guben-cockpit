using Ardalis.SmartEnum;
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

  private readonly List<Source> _sources;
  public IReadOnlyCollection<Source> Sources => _sources.AsReadOnly();

  private DataSource(string id, string name)
  {
    Id = id;
    Name = name;
    _sources = new List<Source>();
  }

  public static Result<DataSource> Create(string id, string name, IList<Source> sources)
  {
    if (!sources.Any())
      return Result.Error(TranslationKeys.AtLeastOneLayerSourceIsRequired);

    var dataSource = new DataSource(id, name);

    dataSource._sources.AddRange(sources);

    return dataSource;
  }
}

public sealed class Source : Entity<Guid>
{
  public string LayerName { get; set; }
  public string Url { get; set; }

  public SourceType Type { get; set; }

  private Source(string layerName, string url)
  {
    Id = Guid.CreateVersion7();
    LayerName = layerName;
    Url = url;
  }

  public static Result<Source> Create(string layerName, string url, SourceType type)
  {
    var source = new Source(layerName, url);
    source.Type = type;

    return source;
  }
}

public sealed class SourceType : SmartEnum<SourceType>
{
  public static readonly SourceType WMS = new SourceType(nameof(WMS), 0);
  public static readonly SourceType WFS = new SourceType(nameof(WFS), 1);
  public static readonly SourceType GeoJson = new SourceType(nameof(GeoJson), 2);

  private SourceType(string name, int value) : base(name, value) { }
}
