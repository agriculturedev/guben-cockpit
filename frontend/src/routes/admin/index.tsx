import { createFileRoute, Navigate} from '@tanstack/react-router'
import { AuthGuard } from "@/guards/authGuard";
import { View2 } from "@/components/layout/View";
import { useTranslation } from "react-i18next";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { useUser } from "@/hooks/useUser";
import { Permissions } from "@/auth/permissions";
import { userHasPermissions } from "@/utilities/userUtils";

export const Route = createFileRoute('/admin/')({
  component: AdminPanel,

})

function AdminPanel() {
  const { t } = useTranslation();
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user && userHasPermissions(user, [Permissions.DashboardManager, Permissions.DashboardEditor])) {
    return <Navigate to="/admin/dashboard" />;
  }

  return (
    <AuthGuard>
      <View2>
        <View2.Content>
          <div className="grid grid-cols-12 gap-4">
            <AdminNavigation />
            <div className='col-span-10 p-6 bg-white rounded-lg'>
              <p>{t("SelectNavItem")}</p>
            </div>
          </div>
        </View2.Content>
      </View2>
    </AuthGuard>
  );
}
