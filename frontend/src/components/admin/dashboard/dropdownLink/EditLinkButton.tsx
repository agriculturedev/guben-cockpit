import { EditIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { CustomTooltip } from "@/components/general/Tooltip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownLinkResponse } from "@/endpoints/gubenSchemas";
import { useDialogFormToggle } from "@/hooks/useDialogFormToggle";
import { useDropdownLinkEdit } from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";

import { DropdownLinkForm } from "./DropdownLinkForm";
import { useDropdownLinkFormSchema } from "./useDropdownLinkFormSchema";

interface EditLinkButtonProps {
  link: DropdownLinkResponse;
  refetch: () => Promise<any>;
}

export const EditLinkButton = ({
  link,
  refetch,
}: EditLinkButtonProps) => {
  const { t } = useTranslation(["dashboard"]);
  const [open, setOpen] = useState(false);

  const mutation = useDropdownLinkEdit({
    onSuccess: async () => {
      await refetch();
      setOpen(false);
    },
    onError: (error) => useErrorToast(error),
  });

  const { formSchema, form } = useDropdownLinkFormSchema(link);
  const toggleDialog = useDialogFormToggle(form, setOpen);
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate({
      body: {
        id: link.id,
        link: values.link,
        title: values.title,
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={toggleDialog}>
      <DialogTrigger>
        <CustomTooltip text={t("EditLink")}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title={t("EditLink")}
          >
            <EditIcon className="h-4 w-4" />
          </Button>
        </CustomTooltip>
      </DialogTrigger>
      <DialogContent className={"min-w-fit"}>
        <DialogHeader>
          <DialogTitle>{t("EditLink")}</DialogTitle>
        </DialogHeader>
        <DropdownLinkForm form={form} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};
