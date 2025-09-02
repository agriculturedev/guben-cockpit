import { useTranslation } from "react-i18next";
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { z } from "zod";

import { useDashboardCreateCard } from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";
import { useDialogFormToggle } from "@/hooks/useDialogFormToggle";
import { AddCardToTabQuery } from "@/endpoints/gubenSchemas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddIconButton } from "@/components/iconButtons/AddIconButton";
import { useDashboardCardFormSchema } from "@/components/dashboard/cards/useDashboardCardFormSchema";
import { DashboardCardForm } from "@/components/dashboard/cards/DashboardCardForm";
import { CustomTooltip } from "@/components/general/Tooltip";
import { Button } from "@/components/ui/button";

interface Props {
  dashboardTabId: string;
  onSuccess?: () => Promise<any>;
}

export const CreateDashboardCardButton = ({
  dashboardTabId,
  onSuccess,
}: Props) => {
  const { t } = useTranslation("dashboard");
  const [open, setOpen] = useState(false);

  const mutation = useDashboardCreateCard({
    onSuccess: async (_) => {
      onSuccess && (await onSuccess());
      toggleDialog(false);
    },
    onError: (error) => {
      useErrorToast(error);
    },
  });

  const { formSchema, form } = useDashboardCardFormSchema();
  const toggleDialog = useDialogFormToggle(form, setOpen);

  function onSubmit(values: z.infer<typeof formSchema>) {
    var updateQuery: AddCardToTabQuery = {
      tabId: dashboardTabId,
      title: values.title,
      description: values.description,
      imageAlt: values.imageAlt,
      imageUrl: values.imageUrl,
      button: values.button,
    };

    mutation.mutate({ body: updateQuery, pathParams: { id: dashboardTabId } });
  }

  return (
    <Dialog open={open} onOpenChange={toggleDialog}>
      <DialogTrigger>
        <Button type="button" variant="secondary" className="h-8 -translate-y-1">
          <PlusIcon className="w-4 h-4" /> {t("Cards.Add")}
        </Button>
      </DialogTrigger>
      <DialogContent overlayClassName="bg-black/0">
        <DialogHeader>
          <DialogTitle>{t("Cards.Add")}</DialogTitle>
        </DialogHeader>
        <DashboardCardForm form={form} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};
