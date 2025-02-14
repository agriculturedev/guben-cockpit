using Api.Controllers.Geo.Shared;
using Domain.Topic;
using Shared.Api;

namespace Api.Controllers.Geo.GetTopics;

public class GetTopicsHandler : ApiRequestHandler<GetTopicsQuery, GetTopicsResponse>
{
  // real implementation should use repository

  public override Task<GetTopicsResponse> Handle(GetTopicsQuery request, CancellationToken cancellationToken)
  {
    var topics = CreateTestTopics();

    return Task.FromResult(new GetTopicsResponse()
    {
      Topics = topics.Select(TopicResponse.Map)
    });
  }


  private List<Topic> CreateTestTopics()
  {
    // NOTE: NEVER use .Value of a result in real code, this is just a test endpoint
    var wfsLayer = Source.Create("wfs layer", "https://geoserverurl.org/wfs").Value;
    var wmsLayer = Source.Create("wms layer", "https://geoserverurl.org/wms").Value;

    var dataSourceWithBoth = DataSource.Create("data_source_0", "datasource with WMS and WFS", wmsLayer, wfsLayer).Value;
    var dataSourceWithWmsOnly = DataSource.Create("data_source_1", "datasource with WMS only", wmsLayer, null).Value;
    var dataSourceWithWfsOnly = DataSource.Create("data_source_2", "datasource with WFS only", null, wfsLayer).Value;

    var topicWithWmsAndWfsCombined = Topic.Create("Topic_0", "Topic with WMS and WFS in one datasource").Value;
    var topicWithWmsAndWfsSeparated = Topic.Create("Topic_1", "Topic with WMS and WFS in separate datasources").Value;

    topicWithWmsAndWfsCombined.AddDataSource(dataSourceWithBoth);
    topicWithWmsAndWfsSeparated.AddDataSource(dataSourceWithWmsOnly);
    topicWithWmsAndWfsSeparated.AddDataSource(dataSourceWithWfsOnly);

    return [topicWithWmsAndWfsCombined, topicWithWmsAndWfsSeparated];
  }
}
