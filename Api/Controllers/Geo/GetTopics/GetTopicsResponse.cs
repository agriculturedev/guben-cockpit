using Api.Controllers.Geo.Shared;

namespace Api.Controllers.Geo.GetTopics;

public struct GetTopicsResponse
{
  public required IEnumerable<TopicResponse> Topics { get; set; }
}
