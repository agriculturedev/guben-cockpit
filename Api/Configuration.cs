namespace Api;

public class Configuration
{
  public ConnectionStrings ConnectionStrings { get; set; } = null!;
  public FrontendConfiguration Frontend { get; set; } = null!;
  public NextcloudConfiguration Nextcloud { get; set; } = null!;
  public TopicConfiguration Topic { get; set; } = null!;
}

public class ConnectionStrings
{
  public string DefaultConnection { get; set; } = null!;
}

public class FrontendConfiguration
{
  public string BaseUri { get; set; } = null!;
}

public class NextcloudConfiguration
{
  public string BaseUri { get; set; } = null!;
  public string BaseDirectory { get; set; } = null!;
  public string Username { get; set; } = null!;
  public string Password { get; set; } = null!;
}

public class TopicConfiguration
{
  public string Directory { get; set; } = null!;
}
