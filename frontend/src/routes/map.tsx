import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/map')({
  component: MapComponent,
})

function MapComponent() {
  return <div className="p-0 flex-grow relative h-[calc(100dvh-8.5rem)] w-full">
      <iframe
        className="overflow-hidden border-none"
        src={import.meta.env.VITE_MASTERPORTAL_URL}
        style={{height: '100%', width: '100%'}}
      ></iframe>
  </div>
}
