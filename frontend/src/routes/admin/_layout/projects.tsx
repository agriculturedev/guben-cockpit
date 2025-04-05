import AddBusinessDialog from "@/components/admin/projects/addBusinessDialog";
import AddProjectDialog from "@/components/admin/projects/addProjectDialog";
import DeleteProjectDialog from "@/components/admin/projects/deleteProjectDialog";
import EditProjectDialog from "@/components/admin/projects/editProjectDialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useProjectsGetMyProjects } from "@/endpoints/gubenComponents";
import { createFileRoute } from "@tanstack/react-router";
import { CheckIcon, EditIcon, PlusIcon, TrashIcon, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { routePermissionCheck } from "@/guards/routeGuardChecks";
import { Permissions } from "@/auth/permissions";

export const Route = createFileRoute('/admin/_layout/projects')({
  beforeLoad: async ({context, location}) => {
    routePermissionCheck(context.auth, [Permissions.ProjectContributor, Permissions.PublishProjects])
  },
  component: Page
})

function Page() {
  const {t} = useTranslation(["common", "projects"]);
  const {data: myProjects, refetch} = useProjectsGetMyProjects({});
  const onSuccess = async () => void await refetch();

  return (
    <div className="w-full">
      <div className={"mb-4 flex gap-2 justify-end"}>
        <AddBusinessDialog onCreateSuccess={onSuccess}>
          <Button>
            <div className="flex gap-2 items-center">
              <PlusIcon className="size-4" />
              <p>{t("projects:AddBusiness")}</p>
            </div>
          </Button>
        </AddBusinessDialog>

        <AddProjectDialog onCreateSuccess={onSuccess}>
          <Button>
            <div className="flex gap-2 items-center">
              <PlusIcon className="size-4" />
              <p>{t("projects:Add")}</p>
            </div>
          </Button>
        </AddProjectDialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("Title")}</TableHead>
            <TableHead>{t("Description")}</TableHead>
            <TableHead>{t("projects:Published")}</TableHead>
            <TableHead>{t("projects:IsBusiness")}</TableHead>
            <TableHead className="w-min">{t("Actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {myProjects?.results.map(p => (
            <TableRow key={p.id}>
              <TableCell className="overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[20ch]">{p.title}</TableCell>
              <TableCell className="overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[50ch]">{p.description}</TableCell>
              <TableCell className={"text-neutral-500"}>{p.published ? <CheckIcon /> : <XIcon />}</TableCell>
              <TableCell className={"text-neutral-500"}>{p.isBusiness ? <CheckIcon /> : <XIcon />}</TableCell>
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
