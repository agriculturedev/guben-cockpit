import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/map')({
  component: MapComponent,
})

function MapComponent() {
  return <div className="p-0 relative" style={{
    height: "calc(100vh - 80px)",
  }}>
    <iframe
        className="map-iframe overflow-hidden border-none"
        style={{

            width: "100%"
        }}
        src="https://guben.elie.de/"
        height="100%"
        width="100%"
    ></iframe>
  </div>
}
