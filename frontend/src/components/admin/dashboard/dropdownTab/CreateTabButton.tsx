import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Plus } from "lucide-react";
import { z } from "zod";

import { useDialogFormToggle } from "@/hooks/useDialogFormToggle";
import { Button } from "@/components/ui/button";
import { useDashboardTabFormSchema } from "@/components/dashboard/useDashboardTabFormSchema";
import { DashboardTabForm } from "@/components/dashboard/DashboardTabForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDashboardCreate } from "@/endpoints/gubenComponents";
import { CreateDashboardTabQuery } from "@/endpoints/gubenSchemas";

interface CreateTabButtonProps {
  dropdownId: string;
  onSuccess?: () => void;
}

export const CreateTabButton = ({ dropdownId, onSuccess }: CreateTabButtonProps) => {
  const { t } = useTranslation("dashboard");
  const [open, setOpen] = useState(false);

  const { formSchema, form } = useDashboardTabFormSchema();
  const toggleDialog = useDialogFormToggle(form, setOpen);
  const mutation = useDashboardCreate({
    onSuccess: () => {
      onSuccess?.();
      setOpen(false);
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newTab: CreateDashboardTabQuery = {
      dropdownId,
      mapUrl: values.mapUrl,
      title: values.title,
    }

    mutation.mutate({body: newTab});
  }

  return (
    <Dialog open={open} onOpenChange={toggleDialog}>
      <DialogTrigger>
        <Button
          variant="outline"
          size="sm"
          className="w-fit mt-2 flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Tab
        </Button>
      </DialogTrigger>
      <DialogContent className={"min-w-fit"}>
        <DialogHeader>
          <DialogTitle>{t("Add")}</DialogTitle>
        </DialogHeader>
        <DashboardTabForm form={form} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};
