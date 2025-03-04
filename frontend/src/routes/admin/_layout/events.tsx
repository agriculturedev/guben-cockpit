import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from "react-i18next";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckIcon, XIcon } from "lucide-react";
import { useEventsGetMyEvents } from "@/endpoints/gubenComponents";
import AddEventDialog from "@/components/admin/events/addEventDialog";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute('/admin/_layout/events')({
  component: Page
})

function Page() {
  const {t} = useTranslation(["common", "events"]);
  const {data: myEvents, refetch} = useEventsGetMyEvents({});

  const onAddSuccess = async () => {
    await refetch();
  }

  return (
    <div className="w-ful">
      <div className={"mb-4 flex justify-end"}>
        <AddEventDialog onCreateSuccess={onAddSuccess}>
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
