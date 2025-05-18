using Api.Controllers.Geo.Shared;
using Domain.Topic.repository;
using Shared.Api;

namespace Api.Controllers.Geo.GetTopics;

public class GetTopicsHandler : ApiRequestHandler<GetTopicsQuery, GetTopicsResponse>
{
  private readonly ITopicRepository _topicRepository;
  public GetTopicsHandler(ITopicRepository topicRepository)
  {
    _topicRepository = topicRepository;
  }


  public override async Task<GetTopicsResponse> Handle(GetTopicsQuery request, CancellationToken cancellationToken)
  {
    // var topics = CreateTestTopics();
    var topics = await _topicRepository.GetAllComplete(cancellationToken);

    return new GetTopicsResponse()
    {
      Topics = topics.Select(TopicResponse.Map)
    };
  }
}
