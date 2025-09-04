import { EditIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { DashboardTabForm } from "@/components/dashboard/DashboardTabForm";
import { useDashboardTabFormSchema } from "@/components/dashboard/useDashboardTabFormSchema";
import { CustomTooltip } from "@/components/general/Tooltip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDashboardUpdate } from "@/endpoints/gubenComponents";
import {
  DashboardTabResponse,
  UpdateDashboardTabQuery,
} from "@/endpoints/gubenSchemas";
import { useDialogFormToggle } from "@/hooks/useDialogFormToggle";
import { useErrorToast } from "@/hooks/useErrorToast";

interface EditTabButtonProps {
  tab: DashboardTabResponse;
  refetch: () => Promise<any>;
}

export const EditTabButton = ({ tab, refetch }: EditTabButtonProps) => {
  const { t } = useTranslation(["dashboard"]);
  const [open, setOpen] = useState(false);

  const mutation = useDashboardUpdate({
    onSuccess: () => {
      refetch?.();
      setOpen(false);
    },
    onError: (error) => useErrorToast(error),
  });

  const { formSchema, form } = useDashboardTabFormSchema(tab);
  const toggleDialog = useDialogFormToggle(form, setOpen);
  function onSubmit(values: z.infer<typeof formSchema>) {
    const updateDashboardTabQuery: UpdateDashboardTabQuery = {
      id: tab.id,
      title: values.title,
      mapUrl: values.mapUrl,
    };
    mutation.mutate({ body: updateDashboardTabQuery });
  }

  return (
    <Dialog open={open} onOpenChange={toggleDialog}>
      <DialogTrigger>
        <CustomTooltip text={t("EditTab")}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title={t("EditTab")}
          >
            <EditIcon className="h-4 w-4" />
          </Button>
        </CustomTooltip>
      </DialogTrigger>
      <DialogContent className={"min-w-fit"}>
        <DialogHeader>
          <DialogTitle>{t("EditTab")}</DialogTitle>
        </DialogHeader>
        <DashboardTabForm form={form} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};
