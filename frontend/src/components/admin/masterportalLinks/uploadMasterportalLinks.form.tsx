import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

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
import {
  useMasterportalLinkCreate,
  useMasterportalLinksGetMy,
} from "@/endpoints/gubenComponents";
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

interface IProps {
  onSuccess?: () => void;
}

export default function UploadMasterportalLinksForm({ onSuccess }: IProps) {
  const { t } = useTranslation(["masterportal", "common"]);

  const { refetch } = useMasterportalLinksGetMy({});
  const form: FormReturn = useForm({
    resolver: zodResolver(
      z.object({
        url: z.string().url(t("masterportal:ValidUrl")),
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
      refetch();
      toast(t("masterportal:ToastCreateSuccess"));
      form.reset({ url: "", folder: "", name: "" });
      onSuccess?.();
    },
    onError: () => {
      toast.error(t("masterportal:ToastCreateError"));
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
              <FormLabel>{t("masterportal:FormUrl")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("masterportal:FormUrlPlaceholder")}
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
              <FormLabel>{t("masterportal:FormFolder")}</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("masterportal:FormFolderPlaceholder")}
                    />
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
              <FormLabel>{t("masterportal:FormName")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("masterportal:FormNamePlaceholder")}
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
            {mutation.isPending ? t("common:Loading") : t("masterportal:Save")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
