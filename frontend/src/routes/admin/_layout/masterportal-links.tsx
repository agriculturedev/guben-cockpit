import { createFileRoute } from "@tanstack/react-router";

import { routePermissionCheck } from "@/guards/routeGuardChecks";
import { Permissions } from "@/auth/permissions";
import UploadMasterportalLinksForm from "@/components/admin/masterportalLinks/uploadMasterportalLinks.form";

export const Route = createFileRoute("/admin/_layout/masterportal-links")({
  beforeLoad: async ({ context, location }) => {
    await routePermissionCheck(context.auth, [Permissions.DashboardManager]);
  },
  component: WrappedComponent,
});

function WrappedComponent() {
  return <MasterportalLinks />;
}

function MasterportalLinks() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Masterportal Links</h1>
      <p className="text-sm text-gray-600">
        Add WMS/WFS links with a name and folder. Submissions will later require
        manager approval.
      </p>

      <UploadMasterportalLinksForm />
    </div>
  );
}
