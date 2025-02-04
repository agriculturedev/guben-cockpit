import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_layout/events')({
  component: () => <div className='text-5xl flex items-center justify-center h-full'>Coming soon...</div>,
})
