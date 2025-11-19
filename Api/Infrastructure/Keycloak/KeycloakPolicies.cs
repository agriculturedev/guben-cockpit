namespace Api.Infrastructure.Keycloak;

public static class KeycloakPolicies
{
  public static string[] AllRoles =
  [
    ViewUsers, ProjectContributor, PublishProjects, EventContributor, PublishEvents, DashboardManager, PageManager,
    LocationManager, FooterManager, EditProjects, DeleteProjects, DeleteEvent, EditEvents, BookingManager, UploadGeodata, ManageGeodata,
    DashboardEditor, AdministrativeStaff, School, MasterportalLinkEditor, MasterportalLinkManager
  ];

  #region Users

  public const string ViewUsers = "view_users";

  #endregion

  #region Projects

  public const string ProjectContributor = "project_contributor";
  public const string PublishProjects = "publish_projects";
  public const string EditProjects = "project_editor";
  public const string DeleteProjects = "project_deleter";
  public const string School = "school";

  #endregion

  #region Events

  public const string EventContributor = "event_contributor";
  public const string PublishEvents = "publish_events";
  public const string DeleteEvent = "event_deleter";
  public const string EditEvents = "event_editor";

  #endregion

  #region Locations

  public const string LocationManager = "location_manager";

  #endregion

  #region Booking

  public const string BookingManager = "booking_manager";
  public const string AdministrativeStaff = "administrative_staff";

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

  #region Geodata

  public const string UploadGeodata = "upload_geodata";

  #endregion

  #region ManageGeodata

  public const string ManageGeodata = "manage_geodata";

  #endregion

  #region DashboardEditor

  public const string DashboardEditor = "dashboard_editor";

  #endregion

  #region MasterportalLinkEditor

  public const string MasterportalLinkEditor = "masterportal_link_editor";

  #endregion
  
  #region MasterportalLinkManager

  public const string MasterportalLinkManager = "masterportal_link_manager";

  #endregion
}
