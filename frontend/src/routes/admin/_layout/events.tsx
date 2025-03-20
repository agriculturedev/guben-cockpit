import AddEventDialog from "@/components/admin/events/addEventDialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useEventsGetMyEvents } from "@/endpoints/gubenComponents";
import { createFileRoute } from '@tanstack/react-router';
import { CheckIcon, TrashIcon, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import DeleteEventDialog from "@/components/admin/events/deleteEventDialog";
import { Permissions } from "@/auth/permissions";
import { redirect } from '@tanstack/react-router'
import { getUserFromAuth, userHasPermission } from "@/utilities/userUtils";

export const Route = createFileRoute('/admin/_layout/events')({
  beforeLoad: async ({context, location}) => {
    const user = getUserFromAuth(context.auth);
    if (!user || !userHasPermission(user, Permissions.EventContributor)){
      throw redirect({
        to: '/'
      });
    }
  },
  component: Page
})

function Page() {
  const {t} = useTranslation(["common", "events"]);
  const {data: myEvents, refetch} = useEventsGetMyEvents({});

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
            <TableRow>
              <TableCell>{e.title}</TableCell>
              <TableCell className="overflow-ellipsis">
                <Textarea>
                  {e.description}
                </Textarea>
              </TableCell>
              <TableCell className="overflow-ellipsis">{new Date(e.startDate).formatDateTime(false)}</TableCell>
              <TableCell className="overflow-ellipsis">{new Date(e.endDate).formatDateTime(false)}</TableCell>
              <TableCell className="overflow-ellipsis">{e.location.name} - {e.location.city}</TableCell>
              <TableCell className="overflow-ellipsis">{e.categories.map(c => c.name).join(", ")}</TableCell>
              <TableCell className={"text-neutral-500"}>{e.published ? <CheckIcon /> : <XIcon />}</TableCell>
              <TableCell>
                  <DeleteEventDialog eventId={e.id} onDeleteSuccess={refetch}>
                    <TrashIcon className="size-4 hover:text-red-500"/>
                  </DeleteEventDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
