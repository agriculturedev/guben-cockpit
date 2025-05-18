import * as React from 'react'
import {createFileRoute} from '@tanstack/react-router'
import {useFooterItemsGetAll} from '@/endpoints/gubenComponents'
import {useTranslation} from 'react-i18next'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table'
import {Button} from '@/components/ui/button'
import {routePermissionCheck} from '@/guards/routeGuardChecks'
import {Permissions} from '@/auth/permissions'
import UpsertFooterItemDialog from '@/components/admin/footer/upsertFooterItemDialog'
import { TooltipProvider } from "@/components/ui/tooltip";
import EditProjectDialog from "@/components/admin/projects/editProjectDialog";
import { EditIcon, TrashIcon } from "lucide-react";
import DeleteProjectDialog from "@/components/admin/projects/deleteProjectDialog";
import DeleteFooterItemDialog from '@/components/admin/footer/deleteFooterItemDialog'

export const Route = createFileRoute('/admin/_layout/footer')({
  beforeLoad: async ({context, location}) => {
    await routePermissionCheck(context.auth, [Permissions.FooterManager])
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
        <UpsertFooterItemDialog onCreateSuccess={refetch}>
          <Button>{t('footer:Add')}</Button>
        </UpsertFooterItemDialog>
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
            <TableRow key={l.id}>
              <TableCell>{l.name}</TableCell>
              <TableCell>
                <div className="text-neutral-800" dangerouslySetInnerHTML={{ __html: l.content }} />
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <div className="h-full flex items-center gap-2">
                    <UpsertFooterItemDialog footerItem={l} onCreateSuccess={refetch}>
                      <EditIcon className="size-4 hover:text-red-500"/>
                    </UpsertFooterItemDialog>

                    <DeleteFooterItemDialog footerItemId={l.id} onDeleteSuccess={refetch}>
                      <TrashIcon className="size-4 hover:text-red-500"/>
                    </DeleteFooterItemDialog>
                  </div>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
