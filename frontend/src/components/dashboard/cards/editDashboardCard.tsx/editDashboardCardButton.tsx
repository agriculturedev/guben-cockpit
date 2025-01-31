import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import {  useDashboardCardUpdate } from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";
import { useDashboardCardFormSchema } from "@/components/dashboard/cards/useDashboardCardFormSchema";
import { InformationCardResponse, UpdateCardOnTabQuery } from "@/endpoints/gubenSchemas";
import { DashboardCardForm } from "@/components/dashboard/cards/DashboardCardForm";
import { EditIconButton } from "@/components/iconButtons/EditIconButton";
import {  z } from "zod";
import { useDialogFormToggle } from "@/hooks/useDialogFormToggle";

interface DeleteDashboardCardButtonProps {
  dashboardTabId: string;
  card: InformationCardResponse;

  refetch: () => Promise<any>;
}

export const EditDashboardCardButton = ({dashboardTabId, card, refetch}: DeleteDashboardCardButtonProps) => {
  const {t} = useTranslation(["dashboard"]);
  const [open, setOpen] = useState(false);

  const mutation = useDashboardCardUpdate({
    onSuccess: async () => {
      toggleDialog(false);
      await refetch();
    },
    onError: (error) => {
      useErrorToast(error);
    }
  });

  const {formSchema, form} = useDashboardCardFormSchema(card);
  const toggleDialog = useDialogFormToggle(form, setOpen);

  function onSubmit(values: z.infer<typeof formSchema>) {
    var updateQuery: UpdateCardOnTabQuery = {
      tabId: dashboardTabId,
      cardId: card.id,
      title: values.title,
      description: values.description,
      imageAlt: values.imageAlt,
      imageUrl: values.imageUrl,
      button: values.button,

    }

    mutation.mutate({body: updateQuery, pathParams: {id: dashboardTabId, cardId: card.id}});
  }

  return (
    <Dialog open={open} onOpenChange={toggleDialog}>
      <EditIconButton tooltip={t("Cards.Edit")} dialogTrigger={true}/>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Cards.Edit")}</DialogTitle>
        </DialogHeader>

        <DashboardCardForm form={form} onSubmit={onSubmit}/>
      </DialogContent>
    </Dialog>
  )
}
