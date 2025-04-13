import * as React from 'react'
import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { PaginationContainer } from '@/components/DataDisplay/PaginationContainer'
import { defaultPaginationProps, usePagination } from '@/hooks/usePagination'
import { useFooterItemsGetAll, useLocationsGetAllPaged } from '@/endpoints/gubenComponents'
import { useTranslation } from 'react-i18next'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import AddLocationDialog from '@/components/admin/locations/addLocationDialog'
import { Button } from '@/components/ui/button'
import { routePermissionCheck } from '@/guards/routeGuardChecks'
import { Permissions } from '@/auth/permissions'

export const Route = createFileRoute('/admin/_layout/footer')({
  beforeLoad: async ({context, location}) => {
    routePermissionCheck(context.auth, [Permissions.FooterManager])
  },
  component: WrappedComponent,
})

function WrappedComponent() {
  return <FooterComponent/>
}

function FooterComponent() {
  const {t} = useTranslation(['common', 'footer'])

  const {data: footerItemsResponse, refetch} = useFooterItemsGetAll({})

  return (
    <div className="w-ful">
      <div className={'mb-4 flex justify-end'}>
        <AddFooterDialog onCreateSuccess={refetch}>
          <Button>{t('footer:Add')}</Button>
        </AddFooterDialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('common:Name')}</TableHead>
            <TableHead>{t('footer:Content')}</TableHead>
            <TableHead className="w-min">{t('common:Actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {footerItemsResponse?.footerItems?.map((l) => (
            <TableRow key={l.name}>
              <TableCell>{l.name}</TableCell>
              <TableCell>{l.content}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
