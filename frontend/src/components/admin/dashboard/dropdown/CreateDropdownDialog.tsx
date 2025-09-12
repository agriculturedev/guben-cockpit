import { useTranslation } from "react-i18next";
import { FormEvent, useCallback, useRef, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useDashboardDropdownCreate,
  useDashboardDropdownGetAll,
} from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";

type DropdownType = "tabs" | "link";

interface CreateDropdownDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  defaultType?: DropdownType;
}

export default function CreateDropdownDialog({
  open,
  setOpen,
  defaultType = "tabs",
}: CreateDropdownDialogProps) {
  const { t } = useTranslation(["dashboard", "common"]);
  const { refetch } = useDashboardDropdownGetAll({});
  const [title, setTitle] = useState("");
  const [type, setType] = useState<DropdownType>(defaultType);
  const formRef = useRef<HTMLFormElement>(null);

  const mutation = useDashboardDropdownCreate({
    onSuccess: async () => {
      await refetch();
      setOpen(false);
    },
    onError: (error) => useErrorToast(error),
  });

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      mutation.mutate({
        body: {
          title,
          isLink: type === "link",
        },
      });
    },
    [mutation, title, type],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("CreateDropdown")}</DialogTitle>
        </DialogHeader>

        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="grid gap-4 py-2 mt-2"
        >
          <div className="grid gap-2">
            <Label htmlFor="dropdown-title">{t("common:Title")}</Label>
            <Input
              id="dropdown-title"
              type="text"
              placeholder="Enter dropdown title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>{t("common:Type")}</Label>
            <Select
              value={type}
              onValueChange={(value: DropdownType) => setType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("SelectType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tabs">{t("Tabs")}</SelectItem>
                <SelectItem value="link">{t("Link")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("common:Cancel")}
          </Button>
          <Button
            onClick={() => formRef.current?.requestSubmit()}
            disabled={mutation.isPending}
          >
            {t("Create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
