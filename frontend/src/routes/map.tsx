import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/map')({
  component: MapComponent,
})

function MapComponent() {
  return <div className="p-0 relative h-full w-full">
    <iframe
        className="map-iframe overflow-hidden border-none"
        src="https://guben.elie.de/"
        height="100%"
        width="100%"
    ></iframe>
  </div>
}
