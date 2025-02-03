import { UserList } from '@/components/admin/UsersList'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_layout/users')({
  component: UserList,
})
