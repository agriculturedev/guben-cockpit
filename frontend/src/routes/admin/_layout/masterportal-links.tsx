import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { routePermissionCheck } from "@/guards/routeGuardChecks";
import { Permissions } from "@/auth/permissions";
import { MyMasterportalLinks } from "@/components/admin/masterportalLinks/myMasterportalLinks";
import { CreateMasterportalLinkButton } from "@/components/admin/masterportalLinks/createMasterportalLinkButton";

export const Route = createFileRoute("/admin/_layout/masterportal-links")({
  beforeLoad: async ({ context, location }) => {
    await routePermissionCheck(context.auth, [
      Permissions.MasterportalLinkEditor,
      Permissions.MasterportalLinkManager,
    ]);
  },
  component: WrappedComponent,
});

function WrappedComponent() {
  return <MasterportalLinks />;
}

function MasterportalLinks() {
  const { t } = useTranslation(["masterportal"]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {t("masterportal:MyMasterportalLinks")}
        </h2>

        <CreateMasterportalLinkButton />
      </div>

      <p className="text-sm text-gray-500">
        {t("masterportal:MyMasterportalLinksDescription")}
      </p>

      <MyMasterportalLinks />
    </div>
  );
}
