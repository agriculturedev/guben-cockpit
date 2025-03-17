import AddProjectDialog from "@/components/admin/projects/addProjectDialog";
import DeleteProjectDialog from "@/components/admin/projects/deleteProjectDialog";
import EditProjectDialog from "@/components/admin/projects/editProjectDialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useProjectsGetMyProjects } from "@/endpoints/gubenComponents";
import { createFileRoute } from "@tanstack/react-router";
import { CheckIcon, EditIcon, TrashIcon, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute('/admin/_layout/projects')({
  component: Page
})

function Page() {
  const {t} = useTranslation(["common", "projects"]);
  const {data: myProjects, refetch} = useProjectsGetMyProjects({});
  const onSuccess = async () => void await refetch();

  return (
    <div className="w-ful">
      <div className={"mb-4 flex justify-end"}>
        <AddProjectDialog onCreateSuccess={onSuccess}>
          <Button>{t("projects:Add")}</Button>
        </AddProjectDialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("Title")}</TableHead>
            <TableHead>{t("Description")}</TableHead>
            <TableHead>{t("projects:Highlighted")}</TableHead>
            <TableHead>{t("projects:Published")}</TableHead>
            <TableHead className="w-min">{t("Actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {myProjects?.results.map(p => (
            <TableRow>
              <TableCell className="overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[20ch]">{p.title}</TableCell>
              <TableCell className="overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[50ch]">{p.description}</TableCell>
              <TableCell className={"text-neutral-500"}>{p.highlighted ? <CheckIcon /> : <XIcon />}</TableCell>
              <TableCell className={"text-neutral-500"}>{p.published ? <CheckIcon /> : <XIcon />}</TableCell>
              <TableCell>
                <TooltipProvider>
                  <div className="h-full flex items-center gap-2">
                    <EditProjectDialog project={p} onCreateSuccess={onSuccess}>
                      <EditIcon className="size-4 hover:text-red-500"/>
                    </EditProjectDialog>

                    <DeleteProjectDialog projectId={p.id} onDeleteSuccess={onSuccess}>
                      <TrashIcon className="size-4 hover:text-red-500"/>
                    </DeleteProjectDialog>
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
