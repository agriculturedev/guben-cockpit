import AddBusinessDialog from "@/components/admin/projects/addBusinessDialog";
import AddProjectDialog from "@/components/admin/projects/addProjectDialog";
import DeleteProjectDialog from "@/components/admin/projects/deleteProjectDialog";
import EditProjectDialog from "@/components/admin/projects/editProjectDialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useProjectsGetMyProjects } from "@/endpoints/gubenComponents";
import { createFileRoute } from "@tanstack/react-router";
import { CheckIcon, EditIcon, FileUpIcon, PlusIcon, TrashIcon, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { routePermissionCheck } from "@/guards/routeGuardChecks";
import { Permissions } from "@/auth/permissions";
import PublishProjectDialog from "@/components/admin/projects/publishProjectDialog";
import { ProjectType } from "@/types/ProjectType";
import AddSchoolDialog from "@/components/admin/projects/addSchoolDialog";
import { useState } from "react";
import { PermissionGuard } from "@/guards/permissionGuard";

export const Route = createFileRoute('/admin/_layout/projects')({
  beforeLoad: async ({context, location}) => {
    await routePermissionCheck(context.auth, [Permissions.ProjectContributor, Permissions.PublishProjects, Permissions.School])
  },
  component: Page
})

function Page() {
  const {t} = useTranslation(["common", "projects"]);
  const {data: myProjects, refetch} = useProjectsGetMyProjects({});
  const onSuccess = async () => void await refetch();
  const [editProjectId, setEditProjectId] = useState<string | null>(null);

  return (
    <div className="w-full">
      <PermissionGuard permissions={[Permissions.ProjectContributor]}>
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

          <AddSchoolDialog onCreateSuccess={onSuccess}>
            <Button>
              <div className="flex gap-2 items-center">
                <PlusIcon className="size-4" />
                <p>{t("projects:AddSchool")}</p>
              </div>
            </Button>
          </AddSchoolDialog>
        </div>
      </PermissionGuard>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("Title")}</TableHead>
            <TableHead>{t("Description")}</TableHead>
            <TableHead>{t('EditorEmail')}</TableHead>
            <TableHead>{t("projects:Published")}</TableHead>
            <TableHead>{t("projects:IsBusiness")}</TableHead>
            <TableHead>{t("projects:IsSchool")}</TableHead>
            <TableHead className="w-min">{t("Actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {myProjects?.results.map(p => (
            <TableRow key={p.id}>
              <TableCell className="overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[20ch]">{p.title}</TableCell>
              <TableCell className="overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[50ch]">{p.description}</TableCell>
              <TableCell className="overflow-ellipsis overflow-hidden whitespace-nowrap map-w-[20ch]">{p.editorEmail}</TableCell>
              <TableCell className={"text-neutral-500"}>{p.published ? <CheckIcon /> : <XIcon />}</TableCell>
              <TableCell className={"text-neutral-500"}>{p.type == ProjectType.GubenerMarktplatz ? <CheckIcon /> : <XIcon />}</TableCell>
              <TableCell className={"text-neutral-500"}>{p.type == ProjectType.Schule ? <CheckIcon /> : <XIcon />}</TableCell>
              <TableCell>
                <TooltipProvider>
                  <div className="h-full flex items-center gap-2">
                    <button onClick={() => setEditProjectId(p.id)}>
                      <EditIcon className="size-4 hover:text-red-500"/>
                    </button>
                    {editProjectId === p.id && (
                      <EditProjectDialog
                        project={p}
                        onCreateSuccess={onSuccess}
                        open={true}
                        onOpenChange={(open) => { if (!open) setEditProjectId(null) }}>
                      </EditProjectDialog>
                    )}

                    <PermissionGuard permissions={[Permissions.ProjectContributor, Permissions.PublishProjects]}>
                      <PublishProjectDialog projectId={p.id} isPublished={p.published} onToggleSuccess={onSuccess}>
                        <FileUpIcon className="size-4 hover:text-red-500"/>
                      </PublishProjectDialog>

                      <DeleteProjectDialog projectId={p.id} type={ProjectType[p.type]} onDeleteSuccess={onSuccess}>
                        <TrashIcon className="size-4 hover:text-red-500"/>
                      </DeleteProjectDialog>
                    </PermissionGuard>
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
