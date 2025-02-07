import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useDashboardCreate } from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";
import { useDialogFormToggle } from "@/hooks/useDialogFormToggle";
import { z } from "zod";
import { CreateDashboardTabQuery } from "@/endpoints/gubenSchemas";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddIconButton } from "@/components/iconButtons/AddIconButton";
import { useDashboardTabFormSchema } from "@/components/dashboard/useDashboardTabFormSchema";
import { DashboardTabForm } from "@/components/dashboard/DashboardTabForm";

interface Props {
  onSuccess?: () => Promise<any>;
}

export const CreateDashboardTabDialogButton = ({onSuccess}: Props) => {
  const {t} = useTranslation("dashboard");
  const [open, setOpen] = useState(false);

  const mutation = useDashboardCreate({
    onSuccess: async (_) => {
      onSuccess && await onSuccess();
      toggleDialog(false);
    },
    onError: (error) => {
      useErrorToast(error);
    }
  });

  const {formSchema, form} = useDashboardTabFormSchema();
  const toggleDialog = useDialogFormToggle(form, setOpen);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newTab: CreateDashboardTabQuery = {
      title: values.title,
      mapUrl: values.mapUrl,
    };

    mutation.mutate({body: newTab});
  }

  return (
    <Dialog open={open} onOpenChange={toggleDialog}>
      <AddIconButton tooltip={t("Add")} dialogTrigger={true}/>
      <DialogContent className={"min-w-fit"}>
        <DialogHeader>
          <DialogTitle>{t("Add")}</DialogTitle>
        </DialogHeader>
        <DashboardTabForm form={form} onSubmit={onSubmit}/>
      </DialogContent>
    </Dialog>
  )
}
