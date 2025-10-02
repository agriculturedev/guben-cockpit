import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useMasterportalLinkCreate } from "@/endpoints/gubenComponents";
import { CreateMasterportalLinkQuery } from "@/endpoints/gubenSchemas";

const folders = [
  { id: "base-maps", name: "Base Maps" },
  { id: "transport", name: "Transport" },
  { id: "environment", name: "Environment" },
];

type OnSubmitFnArgs = {
  url: string;
  folder: string;
  name: string;
};

type FormReturn = UseFormReturn<
  {
    url: string;
    folder: string;
    name: string;
  },
  any,
  undefined
>;

interface IProps {}

export default function UploadMasterportalLinksForm(props: IProps) {
  const form: FormReturn = useForm({
    resolver: zodResolver(
      z.object({
        url: z.string().url("Please enter a valid URL"),
        folder: z.string(),
        name: z.string(),
      }),
    ),
    defaultValues: {
      url: "",
      folder: "",
      name: "",
    },
  });

  const mutation = useMasterportalLinkCreate({
    onSuccess: () => {
      toast("Masterportal link created successfully");
      form.reset({ url: "", folder: "", name: "" });
    },
    onError: () => {
      toast.error("Error creating masterportal link");
    },
  });

  const onSubmit = (values: OnSubmitFnArgs) => {
    const newLink: CreateMasterportalLinkQuery = {
      url: values.url,
      folder: values.folder,
      name: values.name,
    };

    mutation.mutate({ body: newLink });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. https://example.com/wms?layers=LayerA"
                  {...field}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="folder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Folder</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a folder" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {folders.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Background Map Color"
                  {...field}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className={"flex justify-end gap-2"}>
          <Button
            className={"bg-gubenAccent text-gubenAccent-foreground"}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Loading..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
