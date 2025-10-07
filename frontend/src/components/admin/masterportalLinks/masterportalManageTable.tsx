import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useMasterportalLinkApprove,
  useMasterportalLinkReject,
  useMasterportalLinksGetAll,
} from "@/endpoints/gubenComponents";

import { Status } from "./status";
import { MasterportalLinkResponse } from "@/endpoints/gubenSchemas";

export const MasterportalManageTable = () => {
  const { t } = useTranslation(["common"]);
  const [query, setQuery] = useState("");

  const { data, isLoading, refetch } = useMasterportalLinksGetAll({});
  const approveMutation = useMasterportalLinkApprove({
    onSuccess: () => {
      refetch();
    },
  });
  const rejectMutation = useMasterportalLinkReject({
    onSuccess: () => {
      refetch();
    },
  });

  const filtered = useMemo(() => {
    if (!data) return [];

    const q = query.trim().toLowerCase();
    if (!q) return data.links;

    return data.links.filter((i) => i.name.toLowerCase().includes(q));
  }, [data, query]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Manage Masterportal Links</h2>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name"
          className="w-64 bg-white rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gubenAccent"
        />
      </div>

      <div className="rounded-lg shadow-md overflow-hidden">
        <Table className="w-full text-sm">
          <TableHeader className="bg-gray-50">
            <TableRow className="text-left">
              <TableHead className="px-4 py-3">Link</TableHead>
              <TableHead className="px-4 py-3">Folder</TableHead>
              <TableHead className="px-4 py-3">Name</TableHead>
              <TableHead className="px-4 py-3">Status</TableHead>
              <TableHead className="px-4 py-3"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  {t("common:Loading")}...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  {t("common:NoResults")}
                </TableCell>
              </TableRow>
            )}
            {filtered.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.url}</TableCell>
                <TableCell>{row.folder}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  <Status value={row.status} />
                </TableCell>
                <TableCell>
                  <ReviewDialogButton
                    data={row}
                    disabled={row.status !== "Pending"}
                    onApprove={() => {
                      approveMutation.mutate({ pathParams: { id: row.id } });
                    }}
                    onReject={() => {
                      rejectMutation.mutate({ pathParams: { id: row.id } });
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

interface ReviewDialogButtonProps {
  data: MasterportalLinkResponse;
  disabled: boolean;
  onApprove: () => void;
  onReject: () => void;
}

const ReviewDialogButton = ({
  data,
  disabled,
  onApprove,
  onReject,
}: ReviewDialogButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger disabled={disabled}>
        <Button
          variant="outline"
          size="sm"
          className="w-fit mt-2 flex items-center gap-1"
          disabled={disabled}
        >
          Review
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-[520px]">
        <DialogHeader className="mb-2">
          <DialogTitle>Review link</DialogTitle>
          <DialogDescription>
            Confirm the details before approving or rejecting.
          </DialogDescription>
        </DialogHeader>

        <dl className="grid grid-cols-12 gap-x-3 gap-y-2 text-sm mt-4">
          <dt className="col-span-3 text-muted-foreground">Name</dt>
          <dd className="col-span-9">{data.name}</dd>

          <dt className="col-span-3 text-muted-foreground">Link</dt>
          <dd className="col-span-9 break-all">
            <a
              href={data.url}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:opacity-80"
            >
              {data.url}
            </a>
          </dd>

          <dt className="col-span-3 text-muted-foreground">Folder</dt>
          <dd className="col-span-9">{data.folder}</dd>

          <dt className="col-span-3 text-muted-foreground">Status</dt>
          <dd className="col-span-9">
            <Status value={data.status} />
          </dd>
        </dl>

        <DialogFooter className="mt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onReject();
                setOpen(false);
              }}
              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4" /> Reject
            </button>
            <button
              onClick={() => {
                onApprove();
                setOpen(false);
              }}
              className="inline-flex items-center gap-2 rounded-md bg-gubenAccent text-white px-3 py-2 text-sm hover:opacity-90"
            >
              <Check className="h-4 w-4" /> Approve
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
