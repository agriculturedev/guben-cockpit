import { createFileRoute } from '@tanstack/react-router'
import { UserList } from "@/components/admin/UsersList";
import { View } from "@/components/layout/View";
import { AddProjectDialogButton } from "@/components/projects/createProject/CreateProjectDialogButton";
import { AuthGuard } from '@/guards/authGuard';

export const Route = createFileRoute('/admin')({
  component: AdminComponent,
})

function AdminComponent() {
  return (
    <AuthGuard>
      <View>
        <div className={"flex flex-col gap-2"}>
          <AddProjectDialogButton />
          <UserList />
        </div>
      </View>
    </AuthGuard>
  )
}
