import { useState } from "react"
import { createFileRoute } from '@tanstack/react-router'

import { Button } from "@/components/ui/button"
import { routePermissionCheck } from "@/guards/routeGuardChecks"
import { Permissions } from "@/auth/permissions"
import CreateDropdownDialog from "@/components/admin/dashboard/CreateDropdownDialog"
import DropdownList from "@/components/admin/dashboard/DropdownList/DropdownList"

export const Route = createFileRoute('/admin/_layout/dashboard')({
  beforeLoad: async ({context, location}) => {
    await routePermissionCheck(context.auth, [Permissions.DashboardManager])
  },
  component: AdminDashboard,
})

function AdminDashboard() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-8 max-h-full">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">Dropdowns</h1>
        <div className="ml-auto">
          <Button onClick={() => setOpen(true)}>Add Dropdown</Button>
        </div>
      </div>
      <DropdownList />
      <CreateDropdownDialog open={open} setOpen={setOpen} />
    </div>
  )
}
