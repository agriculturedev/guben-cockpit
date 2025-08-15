import { createFileRoute } from '@tanstack/react-router'

import { Permissions } from '@/auth/permissions'
import { GeodataManagerTab, GeodataRow } from '@/components/admin/geodata/geodataManagerTab'
import { routePermissionCheck } from '@/guards/routeGuardChecks'

export const Route = createFileRoute('/admin/_layout/geodatamanage')({
    beforeLoad: async ({context, location}) => {
      await routePermissionCheck(context.auth, [Permissions.DashboardManager])
    },
    component: WrappedComponent,
})

function WrappedComponent() {
    return <GeoDataManageComponent />
}

function GeoDataManageComponent() {
    const mock: GeodataRow[] = [
        {
          id: "geod-001",
          title: "Straßenbäume 2024",
          type: "file_vector",
          requested: ["resiPrivate"],
          uploader: { name: "Alice Müller", email: "alice@example.com" },
          submittedAt: new Date().toISOString(),
          state: "pending_approval",
          meta: { crs: "EPSG:25833", bbox: [13.54, 51.94, 14.80, 52.25], layers: ["trees"] },
        },
        {
          id: "geod-002",
          title: "Bauflächen WMS",
          type: "service_wms",
          requested: ["cockpitPublic"],
          uploader: { name: "Bob Nowak" },
          submittedAt: new Date(Date.now() - 3600_000).toISOString(),
          state: "pending_approval",
        },
    ];

      
    return (
        <GeodataManagerTab
            items={mock}
            onApprove={(p) => console.log("approve", p)}
            onReject={(p) => console.log("reject", p)}
        />
    )
}