using Api.Infrastructure.Extensions;
using Domain.Topic;
using Domain.Topic.repository;
using Shared.Api;

namespace Api.Controllers.Geo.AddTopic;

public class AddTopicsHandler : ApiRequestHandler<AddTopicsQuery, AddTopicsResponse>
{
  private readonly ITopicRepository _topicRepository;
  public AddTopicsHandler(ITopicRepository topicRepository)
  {
    _topicRepository = topicRepository;
  }

  public override async Task<AddTopicsResponse> Handle(AddTopicsQuery request, CancellationToken cancellationToken)
  {
    foreach (var topic in request.Topics)
    {
      var type = SourceType.FromName(topic.Typ);
      var (sourcesResult, sources) = Source.Create(topic.Name, topic.Url, type);
      sourcesResult.ThrowIfFailure();

      var (dataSourceResult, dataSource) = DataSource.Create(topic.Id, topic.Name, [sources]);
      dataSourceResult.ThrowIfFailure();

      var (topicResult, newTopic) = Topic.Create(topic.Id, topic.Name);
      topicResult.ThrowIfFailure();

      newTopic.AddDataSource(dataSource);

      await _topicRepository.SaveAsync(newTopic);
    }

    return new AddTopicsResponse();
  }
}
