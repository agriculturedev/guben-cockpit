import * as React from 'react'
import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { PaginationContainer } from '@/components/DataDisplay/PaginationContainer'
import { defaultPaginationProps, usePagination } from '@/hooks/usePagination'
import { useLocationsGetAllPaged } from '@/endpoints/gubenComponents'
import { useTranslation } from 'react-i18next'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AddLocationDialog from "@/components/admin/locations/addLocationDialog";
import { Button } from "@/components/ui/button";
import { routePermissionCheck } from "@/guards/routeGuardChecks";
import { Permissions } from "@/auth/permissions";

export const Route = createFileRoute('/admin/_layout/locations')({
  beforeLoad: async ({context, location}) => {
    routePermissionCheck(context.auth, [Permissions.LocationManager])
  },
  component: WrappedComponent,
})

function WrappedComponent() {
  return <LocationsComponent/>
}

function LocationsComponent() {
  const {
    page,
    pageCount,
    total,
    pageSize,
    nextPage,
    previousPage,
    setPageIndex,
    setPageSize,
    setTotal,
    setPageCount,
  } = usePagination()
  const {t} = useTranslation(['common', 'locations'])

  const {data: locationsResponse, refetch} = useLocationsGetAllPaged({
    queryParams: {
      pageSize,
      pageNumber: page
    }
  })

  useEffect(() => {
    setTotal(locationsResponse?.totalCount ?? defaultPaginationProps.total)
    setPageCount(
      locationsResponse?.pageCount ?? defaultPaginationProps.pageCount,
    )
  }, [locationsResponse])

  // TODO: some kind of filtering will probably be good, list is very long

  return (
    <div className="w-ful">
      <div className={"mb-4 flex justify-end"}>
        <AddLocationDialog onCreateSuccess={refetch}>
          <Button>{t("locations:Add")}</Button>
        </AddLocationDialog>
      </div>
      <PaginationContainer
        nextPage={nextPage}
        previousPage={previousPage}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        total={total}
        pageCount={pageCount}
        pageSize={pageSize}
        page={page}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("common:Name")}</TableHead>
              <TableHead>{t("locations:City")}</TableHead>
              <TableHead>{t("locations:Zip")}</TableHead>
              <TableHead>{t("locations:Street")}</TableHead>
              <TableHead>{t("locations:TelephoneNumber")}</TableHead>
              <TableHead>{t("locations:Email")}</TableHead>
              <TableHead>{t("locations:Fax")}</TableHead>
              <TableHead className="w-min">{t("common:Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locationsResponse?.results.map(l => (
              <TableRow key={l.id}>
                <TableCell>{l.name}</TableCell>
                <TableCell>{l.city}</TableCell>
                <TableCell>{l.zip}</TableCell>
                <TableCell>{l.street}</TableCell>
                <TableCell>{l.telephoneNumber}</TableCell>
                <TableCell>{l.email}</TableCell>
                <TableCell>{l.fax}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PaginationContainer>
    </div>
  )
}
