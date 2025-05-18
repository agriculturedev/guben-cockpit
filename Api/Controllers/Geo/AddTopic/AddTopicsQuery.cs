using Shared.Api;

namespace Api.Controllers.Geo.AddTopic;

public class AddTopicsQuery : IApiRequest<AddTopicsResponse>
{
  public List<CreateTopicQuery> Topics { get; set; }
}

public class CreateTopicQuery
{
  public string Id { get; set; }
  public string Typ { get; set; }
  public string Url { get; set; }
  public string Name { get; set; }
}
