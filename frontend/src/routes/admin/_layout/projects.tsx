import { AddProjectDialogButton } from '@/components/projects/createProject/CreateProjectDialogButton'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_layout/projects')({
  component: AddProjectDialogButton,
})
