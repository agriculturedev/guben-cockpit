import { PermissionGuard } from "@/guards/permissionGuard";
import { Permissions } from "@/auth/permissions";
import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const AdminNavigation = () => {
  const {t} = useTranslation(["dashboard", "projects", "users", "events", "pages", "locations", "footer", "geodata"]);

  return (
    <Nav className="col-span-2 h-fit">
      <PermissionGuard permissions={[Permissions.DashboardManager]}>
        <Nav.Item href={"/admin/dashboard"} label={t("Title", {ns: "dashboard"})}/>
      </PermissionGuard>

      <PermissionGuard permissions={[Permissions.ViewUsers]}>
        <Nav.Item href={"/admin/users"} label={t("Title", {ns: "users"})}/>
      </PermissionGuard>

      <PermissionGuard permissions={[Permissions.PageManager]}>
        <Nav.Item href={"/admin/pages"} label={t("Title", {ns: "pages"})}/>
      </PermissionGuard>

      <PermissionGuard permissions={[Permissions.ProjectContributor, Permissions.PublishProjects]}>
        <Nav.Item href={"/admin/projects"} label={t("Title", {ns: "projects"})}/>
      </PermissionGuard>

      <PermissionGuard permissions={[Permissions.EventContributor, Permissions.PublishEvents]}>
        <Nav.Item href={"/admin/events"} label={t("Title", {ns: "events"})}/>
      </PermissionGuard>

      <PermissionGuard permissions={[Permissions.LocationManager]}>
        <Nav.Item href={"/admin/locations"} label={t("Title", {ns: "locations"})}/>
      </PermissionGuard>

      <PermissionGuard permissions={[Permissions.FooterManager]}>
        <Nav.Item href={"/admin/footer"} label={t("Title", {ns: "footer"})}/>
      </PermissionGuard>

      <PermissionGuard permissions={[Permissions.FooterManager]}>
        <Nav.Item href={"/admin/geodata"} label={t("Title", {ns: "geodata"})}/>
      </PermissionGuard>

      <PermissionGuard permissions={[Permissions.DashboardManager]}>
        <Nav.Item href={"/admin/geodatamanage"} label={t("ManageGeodata", {ns: "geodata"})}/>
      </PermissionGuard>
    </Nav>
  )
}

type NavProps = {
  className?: string;
} & PropsWithChildren;

function Nav({children, ...props}: NavProps) {
  return (
    <div className={cn("bg-white rounded-lg p-4 flex flex-col max-h-fit", props.className ?? "")}>
      <ul className='flex flex-col gap-2'>
        {children}
      </ul>
    </div>
  )
}

type NavItemProps = {
  href: string;
  label: string;
}

Nav.Item = (props: NavItemProps) => {
  const location = useLocation();

  return (
    <li>
      <Link
        className={cn(
          "py-2 px-1 flex justify-center items-center rounded-lg hover:bg-gray-100 hover:cursor-pointer",
          props.href == location.pathname ? "text-white bg-gubenAccent hover:bg-gubenAccent" : ""
        )}
        to={props.href}
      >
        {props.label}
      </Link>
    </li>
  )
}
