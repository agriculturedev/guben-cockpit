import { Permissions } from '@/auth/permissions';
import { Dropzone } from '@/components/Dropzone';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectItem } from '@/components/ui/select';
import { useGeoGetAllGeoDataSources, useGeoUploadGeoDataSource } from '@/endpoints/gubenComponents';
import { routePermissionCheck } from '@/guards/routeGuardChecks'
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const Route = createFileRoute('/admin/_layout/data-management')({
  beforeLoad: async ({ context }) => {
    await routePermissionCheck(context.auth, [Permissions.DataManager]);
  },
  component: Page,
})

const formSchema = z.object({
  isPublic: z.boolean().default(false),
  type: z.enum(["WMS", "WFS"])
})

type FormSchema = z.infer<typeof formSchema>;

function Page() {
  const { data } = useGeoGetAllGeoDataSources({});
  const mut = useGeoUploadGeoDataSource({});

  const [file, setFile] = useState<File | undefined>(undefined);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isPublic: false
    }
  });

  const handleSubmit = form.handleSubmit(async (formdata) => {
    if(file == undefined) return;
    mut.mutate({body: {
      type: { //TODO: figure this out, the backend has some stupid "smart enum" that f's up the whole codegen.
        name: formdata.type
      },
      isPublic: formdata.isPublic,
      file: file
    }});
  });

  //TODO:
  // - get all files and display in a table
  // - link up form the submit correctly
  // - do some basic styling
  // - be able to approve uploaded geo-files as a data_manager
  console.log(data);

  return (
    <div className='w-full'>
      <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
        <Dropzone onDrop={(files) => setFile(files[0])}/>
        <div className='flex items-center space-x-2'>
          <Checkbox />
          <Label>Is publicly accesible</Label>
        </div>
        <div>
          <Label>Geodata type</Label>
          <Select>
            <SelectItem value="WMS">WMS</SelectItem>
            <SelectItem value="WFS">WFS</SelectItem>
          </Select>
        </div>
        <Button type="submit" disabled={!form.formState.isValid || file == undefined}>Upload</Button>
      </form>

      {/* Add a check for data_manager role before showing to-approve geo-files in a tabel with an "approve" button */}
    </div>
  );
}
