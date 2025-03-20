import { UserList } from '@/components/admin/UsersList'
import { createFileRoute } from '@tanstack/react-router'
import { routePermissionCheck } from "@/guards/routeGuardChecks";
import { Permissions } from "@/auth/permissions";

export const Route = createFileRoute('/admin/_layout/users')({
  beforeLoad: async ({context, location}) => {
    routePermissionCheck(context.auth, [Permissions.ViewUsers])
  },
  component: UserList,
})
