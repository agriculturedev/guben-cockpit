import { createFileRoute } from "@tanstack/react-router";
import { routePermissionCheck } from "@/guards/routeGuardChecks";
import { Permissions } from "@/auth/permissions";
import { MasterportalManageTable } from "@/components/admin/masterportalLinks/masterportalManageTable";

export const Route = createFileRoute("/admin/_layout/masterportal-manage")({
  beforeLoad: async ({ context, location }) => {
    await routePermissionCheck(context.auth, [Permissions.MasterportalLinkManager]);
  },
  component: WrappedComponent,
});

function WrappedComponent() {
  return <MasterportalManageTable />;
}