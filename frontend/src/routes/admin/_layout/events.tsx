import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useEventsGetMyEvents } from "@/endpoints/gubenComponents";
import { createFileRoute } from '@tanstack/react-router';
import { CheckIcon, EditIcon, FileUpIcon, TrashIcon, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Permissions } from "@/auth/permissions";
import { routePermissionCheck } from "@/guards/routeGuardChecks";
import { PaginationContainer } from "@/components/DataDisplay/PaginationContainer";
import { defaultPaginationProps, usePagination } from "@/hooks/usePagination";
import { useEffect, useState } from "react";

import AddEventDialog from "@/components/admin/events/addEventDialog";
import DeleteEventDialog from "@/components/admin/events/deleteEventDialog";
import PublishEventDialog from "@/components/admin/events/publishEventDialog";
import EditEventDialog from "@/components/admin/events/editEventDialog";

export const Route = createFileRoute('/admin/_layout/events')({
  beforeLoad: async ({ context, location }) => {
    await routePermissionCheck(context.auth, [Permissions.EventContributor, Permissions.PublishEvents])
  },
  component: Page
})

function Page() {
  const { t } = useTranslation(["common", "events"]);
  const [editEventId, setEditEventId] = useState<string | null>(null);

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
    setPageCount
  } = usePagination();


  const { data: myEvents, refetch } = useEventsGetMyEvents({
    queryParams: {
      pageSize: pageSize,
      pageNumber: page
    }
  });

  const onSuccess = async () => void await refetch();

  useEffect(() => {
    setTotal(myEvents?.totalCount ?? defaultPaginationProps.total);
    setPageCount(myEvents?.pageCount ?? defaultPaginationProps.pageCount);
  }, [myEvents]);

  return (
    <div className="w-ful">
      <div className={"mb-4 flex justify-end"}>
        <AddEventDialog onCreateSuccess={refetch}>
          <Button>{t("events:Add")}</Button>
        </AddEventDialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("Title")}</TableHead>
            <TableHead>{t("Description")}</TableHead>
            <TableHead>{t("StartDate")}</TableHead>
            <TableHead>{t("EndDate")}</TableHead>
            <TableHead>{t("Location")}</TableHead>
            <TableHead>{t("Categories")}</TableHead>
            <TableHead>{t("events:Published")}</TableHead>
            <TableHead className="w-min">{t("Actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {myEvents?.results.map(e => (
            <TableRow key={e.id}>
              <TableCell>{e.title}</TableCell>
              <TableCell className="overflow-ellipsis">
                <Textarea defaultValue={e.description} />
              </TableCell>
              <TableCell className="overflow-ellipsis">{new Date(e.startDate).formatDateTime(false)}</TableCell>
              <TableCell className="overflow-ellipsis">{new Date(e.endDate).formatDateTime(false)}</TableCell>
              <TableCell className="overflow-ellipsis">{e.location.name} - {e.location.city}</TableCell>
              <TableCell className="overflow-ellipsis">{e.categories.map(c => c.name).join(", ")}</TableCell>
              <TableCell className={"text-neutral-500"}>{e.published ? <CheckIcon /> : <XIcon />}</TableCell>
              <TableCell>
                <div className="h-full flex items-center gap-2">
                  <button onClick={() => setEditEventId(e.id)}>
                    <EditIcon className="size-4 hover:text-red-500" />
                  </button>
                  {editEventId === e.id && (
                    <EditEventDialog
                      event={e}
                      onCreateSuccess={onSuccess}
                      open={true}
                      onOpenChange={(open) => { if (!open) setEditEventId(null) }} />
                  )}
                  <PublishEventDialog eventId={e.id} isPublished={e.published} onToggleSuccess={onSuccess}>
                    <FileUpIcon className="size-4 hover:text-red-500" />
                  </PublishEventDialog>
                  <DeleteEventDialog eventId={e.id} onDeleteSuccess={refetch}>
                    <TrashIcon className="size-4 hover:text-red-500" />
                  </DeleteEventDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <section className="max-w-7xl mx-auto flex flex-col gap-4">
        <PaginationContainer
          nextPage={nextPage}
          previousPage={previousPage}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          total={total}
          pageCount={pageCount}
          pageSize={pageSize}
          page={page}>
        </PaginationContainer>
      </section>
    </div>
  )
}
