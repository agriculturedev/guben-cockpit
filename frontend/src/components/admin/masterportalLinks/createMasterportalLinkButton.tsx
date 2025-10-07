import { Plus } from "lucide-react";
import { useState } from "react";

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
          Add masterportal link
        </Button>
      </DialogTrigger>
      <DialogContent className={"min-w-fit"}>
        <DialogHeader className="mb-4">
          <DialogTitle>Upload masterportal link</DialogTitle>
        </DialogHeader>
        <UploadMasterportalLinksForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
