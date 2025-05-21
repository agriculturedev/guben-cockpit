import { DashboardTabForm } from "@/components/dashboard/DashboardTabForm";
import { useDashboardTabFormSchema } from "@/components/dashboard/useDashboardTabFormSchema";
import { useDashboardUpdate } from "@/endpoints/gubenComponents";
import { DashboardTabResponse, UpdateDashboardTabQuery } from "@/endpoints/gubenSchemas";
import { useErrorToast } from "@/hooks/useErrorToast";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { DeleteDashboardTabButton } from "../deleteDashboardTab/DeleteDashboardTabButton";
import { UploadImageCard } from "../cards/UploadImageCard";

interface Props {
  tab: DashboardTabResponse;
  onSuccess: () => Promise<any>;
}

export const EditDashboardTab = ({ tab, onSuccess }: Props) => {
  const { t } = useTranslation(["dashboard", "common"]);

  const mutation = useDashboardUpdate({
    onSuccess: async (_) => onSuccess && await onSuccess(),
    onError: (error) => useErrorToast(error)
  });

  const { formSchema, form } = useDashboardTabFormSchema(tab);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const updateDashboardTabQuery: UpdateDashboardTabQuery = {
      id: tab.id,
      title: values.title,
      mapUrl: values.mapUrl
    };
    mutation.mutate({ body: updateDashboardTabQuery });
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className="flex gap-2 items-center">
        <h1>{t("TabInformation")}</h1>
        <DeleteDashboardTabButton
          dashboardTabId={tab.id}
          refetch={onSuccess}
        />
      </div>
      <DashboardTabForm {...{form, onSubmit}}/>

      <UploadImageCard directory={tab.id} />
      <div className="mb-2"></div>
    </div>
  )
}
