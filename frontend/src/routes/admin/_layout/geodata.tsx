import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'
import { routePermissionCheck } from '@/guards/routeGuardChecks'
import { Permissions } from '@/auth/permissions'
import { DragAndDrop } from '@/components/ui/dragAndDrop'
import { Button } from '@/components/ui/button'
import { useGeoUploadGeoDataSource } from '@/endpoints/gubenComponents'
import { GeoDataSourceType } from '@/endpoints/gubenSchemas'

export const Route = createFileRoute('/admin/_layout/geodata')({
  beforeLoad: async ({context, location}) => {
    await routePermissionCheck(context.auth, [Permissions.FooterManager])
  },
  component: WrappedComponent,
})

function WrappedComponent() {
  return <GeoDataComponent />
}

const TYPE_OPTIONS: GeoDataSourceType[] = [
  { name: 'WFS', value: 0 },
  { name: 'WMS', value: 1 },
];

function GeoDataComponent() {
  const [file, setFile] = useState<File | null>(null)
  const [destPublic, setDestPublic] = useState(false)
  const [destPrivate, setDestPrivate] = useState(false)

  const [selectedType, setSelectedType] = useState<GeoDataSourceType>(TYPE_OPTIONS[0])
  const [customTypeName, setCustomTypeName] = useState<string>('')

  const [status, setStatus] = useState<{ type: 'ok' | 'err'; msg: string; } | null>(null)

  const { mutateAsync: uploadGeo, isPending } = useGeoUploadGeoDataSource()

  const destination = destPublic ? 'public' : destPrivate ? 'private' : null
  const canPublish = Boolean(file && destination && !isPending)

  async function handlePublish() {
    if(!file || !destination || !selectedType.name) return
    setStatus(null)

    const fd = new FormData()
    fd.append('File', file)
    fd.append('Type', selectedType.name)
    fd.append('IsPublic', String(destination === 'public'))
    
    try {
      await uploadGeo({
        body: fd as any,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })

      setStatus({ type: 'ok', msg: 'Uploaded successfully.' })
      setFile(null)
      setDestPublic(false)
      setDestPrivate(false)
    } catch (e: any) {
      const payload = e?.payload as { title?: string; detail?: string; }
      const msg = payload?.title || payload?.detail || e?.message || 'Upload failed'
      setStatus({ type: 'err', msg })
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold" onClick={() => setFile(null)}>Upload Geodata</h1>

      <DragAndDrop
        file={file}
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

      <div className="space-y-2">
        <label className="block text-sm font-medium">Data type</label>
        <div className="flex gap-3">
          <select
            className="w-60 rounded-md border px-3 py-2 text-sm bg-white"
            value={selectedType.value}
            onChange={(e) => {
              const val = Number(e.target.value)
              const found = TYPE_OPTIONS.find((o) => o.value === val)!
              setSelectedType(found)
            }}
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.name}
              </option>
            ))}
          </select>

          {selectedType.value === 99 && (
            <input
              className="flex-1 rounded-md border px-3 py-2 text-sm"
              placeholder="Custom type name (optional)"
              value={customTypeName}
              onChange={(e) => setCustomTypeName(e.target.value)}
            />
          )}
        </div>
      </div>

      {status && (
        <div
          className={cn(
            'text-sm rounded-md p-2',
            status.type === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          )}
        >
          {status.msg}
        </div>
      )}
      
      <Button 
        disabled={!canPublish} 
        onClick={handlePublish}
      >
        { isPending ? 'Publishing...' : 'Publish' }
      </Button>
    </div>
  )
}