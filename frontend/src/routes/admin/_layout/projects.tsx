import ProjectDialog from "@/components/admin/projects";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProjectsGetMyProjects } from "@/endpoints/gubenComponents";
import { createFileRoute } from "@tanstack/react-router";
import { CheckIcon, EditIcon, XIcon } from "lucide-react";

export const Route = createFileRoute('/admin/_layout/projects')({
  component: Page
})

function Page() {
  const {data: myProjects} = useProjectsGetMyProjects({});

  return (
    <div className="">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Highlighted</TableHead>
            <TableHead>Published</TableHead>
            <TableHead className="w-min">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell className="max-w-[20ch] truncate">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestiae ab qui et fugiat quos porro in recusandae consequatur id fuga facilis ipsa incidunt non laboriosam placeat veniam excepturi, minima tenetur.
            </TableCell>
            <TableCell><CheckIcon className="size-sm" /></TableCell>
            <TableCell><XIcon className="size-sm" /></TableCell>
            <TableCell>
              <ProjectDialog>
                <EditIcon className="size-4" />
              </ProjectDialog>
            </TableCell>
          </TableRow>

          {myProjects?.results.map(p => (
            <TableRow>
              <TableCell>{p.title}</TableCell>
              <TableCell className="overflow-ellipsis">{p.description}</TableCell>
              <TableCell>{p.highlighted}</TableCell>
              <TableCell>NEED TO IMPLEMENT (PUBLISHED FLAG)</TableCell>
              <TableCell>
                <ProjectDialog project={p}>
                  <EditIcon className="size-4" />
                </ProjectDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
