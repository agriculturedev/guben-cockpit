import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { routePermissionCheck } from "@/guards/routeGuardChecks";
import { Permissions } from "@/auth/permissions";
import CreateDropdownDialog from "@/components/admin/dashboard/dropdown/CreateDropdownDialog";
import DropdownList from "@/components/admin/dashboard/dropdown/DropdownList";

export const Route = createFileRoute("/admin/_layout/dashboard")({
  beforeLoad: async ({ context, location }) => {
    await routePermissionCheck(context.auth, [Permissions.DashboardManager]);
  },
  component: AdminDashboard,
});

function AdminDashboard() {
  const { t } = useTranslation(["dashboard", "common"]);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-8 max-h-full">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">{t("Dropdowns")}</h1>
        <div className="ml-auto">
          <Button onClick={() => setOpen(true)}>{t("AddDropdown")}</Button>
        </div>
      </div>
      <DropdownList />
      <CreateDropdownDialog open={open} setOpen={setOpen} />
    </div>
  );
}
