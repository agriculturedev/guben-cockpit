import AddProjectDialog from "@/components/admin/projects";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {useProjectsGetMyProjects} from "@/endpoints/gubenComponents";
import {createFileRoute} from "@tanstack/react-router";
import {EditIcon, XIcon, CheckIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useTranslation} from "react-i18next";

export const Route = createFileRoute('/admin/_layout/projects')({
  component: Page
})

function Page() {
  const {t} = useTranslation(["common", "projects"]);
  const {data: myProjects, refetch} = useProjectsGetMyProjects({});

  const onAddSuccess = async () => {
    await refetch();
  }

  return (
    <div className="w-ful">
      <div className={"mb-4 flex justify-end"}>
        <AddProjectDialog onCreateSuccess={onAddSuccess}>
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
              <TableCell>{p.title}</TableCell>
              <TableCell className="overflow-ellipsis">{p.description}</TableCell>
              <TableCell className={"text-neutral-500"}>{p.highlighted ? <CheckIcon /> : <XIcon />}</TableCell>
              <TableCell className={"text-neutral-500"}>{p.published ? <CheckIcon /> : <XIcon />}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
