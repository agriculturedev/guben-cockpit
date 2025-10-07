import { createFileRoute } from "@tanstack/react-router";

import { routePermissionCheck } from "@/guards/routeGuardChecks";
import { Permissions } from "@/auth/permissions";
import UploadMasterportalLinksForm from "@/components/admin/masterportalLinks/uploadMasterportalLinks.form";
import { MyMasterportalLinks } from "@/components/admin/masterportalLinks/myMasterportalLinks";
import { CreateMasterportalLinkButton } from "@/components/admin/masterportalLinks/createMasterportalLinkButton";

export const Route = createFileRoute("/admin/_layout/masterportal-links")({
  beforeLoad: async ({ context, location }) => {
    await routePermissionCheck(context.auth, [Permissions.MasterportalLinkEditor, Permissions.MasterportalLinkManager]);
  },
  component: WrappedComponent,
});

function WrappedComponent() {
  return <MasterportalLinks />;
}

function MasterportalLinks() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">My masterportal links</h2>

        <CreateMasterportalLinkButton />
      </div>

      <p className="text-sm text-gray-500">
        View and manage your submitted masterportal links.
      </p>

      <MyMasterportalLinks />
    </div>
  );
}
