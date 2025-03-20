import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { WithClassName } from "@/types/WithClassName";
import { useTranslation } from "react-i18next";
import { DashboardTabFormType } from "./useDashboardTabFormSchema";
import { isNullOrUndefinedOrWhiteSpace } from "@/utilities/nullabilityUtils";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapComponent } from "@/components/home/MapComponent";

type OnSubmitFnArgs = { title: string, mapUrl: string }

interface DashboardFormProps extends WithClassName {
  form: DashboardTabFormType;
  onSubmit: (values: OnSubmitFnArgs) => void;
}

export const DashboardTabForm = ({ form, onSubmit, className }: DashboardFormProps) => {
  const { t } = useTranslation(["dashboard", "common"]);

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-4', className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='flex gap-4 min-w-[20rem] w-fit'>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>{t("common:Title")}</FormLabel>
                <FormControl>
                  <Input
                    className={"min-w-[10rem]"}
                    placeholder={t("common:Title")}
                    {...field}
                    value={field.value ?? undefined}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mapUrl"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>{t("dashboard:MapUrl")}</FormLabel>
                <FormControl>
                  <div className={"flex gap-2 min-w-[20rem]"}>
                    <Input
                      placeholder={t("dashboard:MapUrl")}
                      {...field}
                      value={field.value ?? undefined}
                    />
                    <MapPreviewDialog mapUrl={field.value} />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={!form.formState.isDirty}
          className='w-32 bg-gubenAccent hover:bg-red-400'
        >
          {t("common:Save")}
        </Button>
      </form>
    </Form>
  )
}

interface MapPreviewProps {
  mapUrl: string;
}

export const MapPreviewDialog = ({mapUrl}: MapPreviewProps) => {
  const mapUrlIsEmpty = isNullOrUndefinedOrWhiteSpace(mapUrl);
  const { t } = useTranslation(["common"]);

  return (
    <Dialog>
      <DialogTrigger disabled={mapUrlIsEmpty}>
        <Button disabled={mapUrlIsEmpty} type={"button"}>
          {t("ShowPreview")}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-5/6 max-w-full h-5/6 p-1 pt-12">
        <MapComponent src={mapUrl} className={"h-full"} />
      </DialogContent>
    </Dialog>
  )
}
