import AddEventDialog from "@/components/admin/events/addEventDialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useEventsGetMyEvents } from "@/endpoints/gubenComponents";
import { createFileRoute } from '@tanstack/react-router';
import { CheckIcon, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute('/admin/_layout/events')({
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
          {myEvents?.results.map(p => (
            <TableRow>
              <TableCell>{p.title}</TableCell>
              <TableCell className="overflow-ellipsis">
                <Textarea>
                  {p.description}
                </Textarea>
              </TableCell>
              <TableCell className="overflow-ellipsis">{new Date(p.startDate).formatDateTime(false)}</TableCell>
              <TableCell className="overflow-ellipsis">{new Date(p.endDate).formatDateTime(false)}</TableCell>
              <TableCell className="overflow-ellipsis">{p.location.name} - {p.location.city}</TableCell>
              <TableCell className="overflow-ellipsis">{p.categories.map(c => c.name).join(", ")}</TableCell>
              <TableCell className={"text-neutral-500"}>{p.published ? <CheckIcon /> : <XIcon />}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
