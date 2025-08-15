import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'
import { routePermissionCheck } from '@/guards/routeGuardChecks'
import { Permissions } from '@/auth/permissions'
import { DragAndDrop } from '@/components/ui/dragAndDrop'

export const Route = createFileRoute('/admin/_layout/geodata')({
  beforeLoad: async ({context, location}) => {
    await routePermissionCheck(context.auth, [Permissions.FooterManager])
  },
  component: WrappedComponent,
})

function WrappedComponent() {
  return <GeoDataComponent />
}

function GeoDataComponent() {
  const [file, setFile] = useState<File | null>(null)
  const [destPublic, setDestPublic] = useState(false)
  const [destPrivate, setDestPrivate] = useState(false)

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Upload Geodata</h1>

      <DragAndDrop
        onFileSelected={setFile}
        acceptExtensions={['.geojson', '.json']}
        maxSizeBytes={1_000_000_000}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer">
          <Checkbox.Root
            id="dest-public"
            checked={destPublic}
            onCheckedChange={(v) => {
              setDestPublic(true)
              setDestPrivate(false)
            }}
            className={cn(
              'h-5 w-5 rounded border flex items-center justify-center mt-0.5',
              destPublic
                ? 'bg-gubenAccent border-gubenAccent'
                : 'bg-white border-gray-400'
            )}
          >
            <Checkbox.Indicator
              className={cn(destPublic ? 'text-white' : 'text-transparent')}
            >
              <Check className="h-4 w-4" />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <div>
            <label htmlFor="dest-public" className="font-medium">
              Guben Cockpit (Public)
            </label>
            <div className="text-xs text-gray-500">
              Will appear publicly in the Masterportal after approval.
            </div>
          </div>
        </label>

        <label className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer">
          <Checkbox.Root
            id="dest-private"
            checked={destPrivate}
            onCheckedChange={(v) => {
              setDestPublic(false)
              setDestPrivate(true)
            }}
            className={cn(
              'h-5 w-5 rounded border flex items-center justify-center mt-0.5',
              destPrivate
                ? 'bg-gubenAccent border-gubenAccent'
                : 'bg-white border-gray-400'
            )}
          >
            <Checkbox.Indicator
              className={cn(destPrivate ? 'text-white' : 'text-transparent')}
            >
              <Check className="h-4 w-4" />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <div>
            <label htmlFor="dest-private" className="font-medium">
              Resi Form (Private)
            </label>
            <div className="text-xs text-gray-500">
              Private access via secure Topic endpoint after approval.
            </div>
          </div>
        </label>
      </div>
    </div>
  )
}