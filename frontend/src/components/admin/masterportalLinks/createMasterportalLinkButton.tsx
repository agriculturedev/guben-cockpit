import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import UploadMasterportalLinksForm from "./uploadMasterportalLinks.form";

export const CreateMasterportalLinkButton = () => {
  const { t } = useTranslation(["masterportal"]);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button
          variant="default"
          size="sm"
          className="w-fit mt-2 flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          {t("AddMasterportalLink")}
        </Button>
      </DialogTrigger>
      <DialogContent className={"min-w-fit"}>
        <DialogHeader className="mb-4">
          <DialogTitle>{t("UploadMasterportalLink")}</DialogTitle>
        </DialogHeader>
        <UploadMasterportalLinksForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
