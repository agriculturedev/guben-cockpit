﻿namespace Api;

public class Configuration
{
  public ConnectionStrings ConnectionStrings { get; set; } = null!;
  public KeycloakConfiguration Keycloak { get; set; } = null!;
  public FrontendConfiguration Frontend { get; set; } = null!;
}

public class ConnectionStrings
{
  public string DefaultConnection { get; set; } = null!;
}

public class KeycloakConfiguration
{
  public string Authority { get; set; } = null!;
  public string Audience { get; set; } = null!;
}

public class FrontendConfiguration
{
  public string BaseUri { get; set; } = null!;
}
