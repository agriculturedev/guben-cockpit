import { DashboardTabResponse, UpdateDashboardTabQuery } from "@/endpoints/gubenSchemas";
import { useDashboardUpdate } from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";
import { useDashboardTabFormSchema } from "@/components/dashboard/useDashboardTabFormSchema";
import { z } from "zod";
import { DashboardTabForm } from "@/components/dashboard/DashboardTabForm";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

interface Props {
  tab: DashboardTabResponse;
  onSuccess: () => Promise<any>;
}

export const EditDashboardTab = ({tab, onSuccess}: Props) => {
  const {t} = useTranslation(["dashboard"]);

  const mutation = useDashboardUpdate({
    onSuccess: async (_) => {
      onSuccess && await onSuccess();
    },
    onError: (error) => {
      useErrorToast(error);
    }
  });

  const {formSchema, form} = useDashboardTabFormSchema(tab);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const updateDashboardTabQuery: UpdateDashboardTabQuery = {
      id: tab.id,
      title: values.title,
      mapUrl: values.mapUrl
    };

    mutation.mutate({body: updateDashboardTabQuery});
  }


  return (<Card className={"flex flex-col gap-2 p-2 h-fit"}>
    <Label className={"text-xl"}>{t("TabInformation")}</Label>
    <DashboardTabForm form={form} onSubmit={onSubmit} className={"w-64"}/>
  </Card>)
}
