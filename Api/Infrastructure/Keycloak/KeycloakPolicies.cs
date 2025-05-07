namespace Api.Infrastructure.Keycloak;

public static class KeycloakPolicies
{
  public static string[] AllRoles =
  [
    ViewUsers, ProjectContributor, PublishProjects, EventContributor, PublishEvents, DashboardManager, PageManager,
    LocationManager, FooterManager
  ];

  #region Users

  public const string ViewUsers = "view_users";

  #endregion

  #region Projects

  public const string ProjectContributor = "project_contributor";
  public const string PublishProjects = "publish_projects";

  #endregion

  #region Events

  public const string EventContributor = "event_contributor";
  public const string PublishEvents = "publish_events";

  #endregion

  #region Locations

  public const string LocationManager = "location_manager";

  #endregion

  #region Dashboard

  public const string DashboardManager = "dashboard_manager";

  #endregion

  #region Page

  public const string PageManager = "page_manager";

  #endregion

  #region Footer

  public const string FooterManager = "footer_manager";

  #endregion
}
