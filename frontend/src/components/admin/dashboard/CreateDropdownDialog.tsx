import { useCallback, useState } from "react";

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
import { useDashboardDropdownCreate, useDashboardDropdownGetAll } from "@/endpoints/gubenComponents";
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
  const { refetch } = useDashboardDropdownGetAll({});
  const [title, setTitle] = useState("");
  const [type, setType] = useState<DropdownType>(defaultType);
  const [link, setLink] = useState("");

  const mutation = useDashboardDropdownCreate({
    onSuccess: async () => {
      await refetch();
      setOpen(false);
    },
    onError: (error) => useErrorToast(error),
  });

  const onSubmit = useCallback(
    () =>
      mutation.mutate({
        body: {
          title,
          link,
        },
      }),
    [mutation],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Dropdown</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2 mt-2">
          <div className="grid gap-2">
            <Label htmlFor="dropdown-title">Title</Label>
            <Input
              id="dropdown-title"
              type="text"
              placeholder="Enter dropdown title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Type</Label>
            <Select
              value={type}
              onValueChange={(value: DropdownType) => setType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tabs">Tabs</SelectItem>
                <SelectItem value="link">Link</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === "link" && (
            <div className="grid gap-2">
              <Label htmlFor="dropdown-link">Link URL</Label>
              <Input
                id="dropdown-link"
                type="text"
                placeholder="https://example.com"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
          )}
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={mutation.isPending}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
