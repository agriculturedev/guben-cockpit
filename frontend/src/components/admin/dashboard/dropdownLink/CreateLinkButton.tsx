import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Plus } from "lucide-react";
import { z } from "zod";

import { useDialogFormToggle } from "@/hooks/useDialogFormToggle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDropdownLinkCreate } from "@/endpoints/gubenComponents";
import { CreateDropdownLinkQuery } from "@/endpoints/gubenSchemas";

import { DropdownLinkForm } from "./DropdownLinkForm";
import { useDropdownLinkFormSchema } from "./useDropdownLinkFormSchema";

interface CreateLinkButtonProps {
  dropdownId: string;
  onSuccess?: () => void;
}

export const CreateLinkButton = ({
  dropdownId,
  onSuccess,
}: CreateLinkButtonProps) => {
  const { t } = useTranslation("dashboard");
  const [open, setOpen] = useState(false);

  const { formSchema, form } = useDropdownLinkFormSchema();
  const toggleDialog = useDialogFormToggle(form, setOpen);

  const mutation = useDropdownLinkCreate({
    onSuccess: () => {
      onSuccess?.();
      setOpen(false);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newLink: CreateDropdownLinkQuery = {
      dropdownId,
      title: values.title,
      link: values.link,
    };

    mutation.mutate({ body: newLink });
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
          Add new link
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-fit">
        <DialogHeader>
          <DialogTitle>Add new link</DialogTitle>
        </DialogHeader>
        <DropdownLinkForm form={form} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};
