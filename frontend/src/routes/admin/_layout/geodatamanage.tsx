import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { Permissions } from '@/auth/permissions'
import { GeodataManagerTab, GeodataRow } from '@/components/admin/geodata/geodataManagerTab'
import { routePermissionCheck } from '@/guards/routeGuardChecks'
import { useGeoGetAllGeoDataSources, useGeoValidate } from '@/endpoints/gubenComponents'

export const Route = createFileRoute('/admin/_layout/geodatamanage')({
    beforeLoad: async ({context, location}) => {
      await routePermissionCheck(context.auth, [Permissions.ManageGeoData])
    },
    component: WrappedComponent,
})

function WrappedComponent() {
    return <GeoDataManageComponent />
}

function GeoDataManageComponent() {
    const { data, isLoading, refetch } = useGeoGetAllGeoDataSources({})
    const validateMutation = useGeoValidate({
      onSuccess: () => {
        refetch();
      },
    })

    const items: GeodataRow[] = useMemo(
      () =>
        data?.sources.map(d => ({
          id: d.id,
          title: d.path.split('/').pop() ?? 'Untitled',
          type: d.type === 0 ? 'WFS' : 'WMS',
          requested: d.isPublic ? 'cockpitPublic' : 'resiPrivate',
          state: d.isValidated ? 'published' : 'pending_approval',
          meta: { path: d.path },
        })) ?? [],
      [data?.sources],
    );

    return (
        <GeodataManagerTab
            items={items}
            isLoading={isLoading}
            onApprove={({ id }) => {
              validateMutation.mutate({ pathParams: { id }, body: { isValid: true } })
            }}
            onReject={({ id }) => {
              validateMutation.mutate({ pathParams: { id }, body: { isValid: false } })
            }}
        />
    )
}