import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check, X, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

import { TypeBadge } from "./typeBadge";
import { Chip } from "./chip";
import type { GeodataRow } from "./geodataManagerTab";

interface ReviewDialogProps {
  row: GeodataRow;
  onApprove?: (payload: {
    id: string;
    approvePublic: boolean;
    approvePrivate: boolean;
    note?: string;
  }) => void;
  onReject?: (payload: { id: string; note?: string }) => void;
}

export const ReviewDialog: React.FC<ReviewDialogProps> = ({
  row,
  onApprove,
  onReject,
}) => {
  const [open, setOpen] = useState(false);
  const [approvePublic, setApprovePublic] = useState(
    row.requested.includes("cockpitPublic"),
  );
  const [approvePrivate, setApprovePrivate] = useState(
    row.requested.includes("resiPrivate"),
  );
  const [note, setNote] = useState("");

  const publicDisabled = !row.requested.includes("cockpitPublic");
  const privateDisabled = !row.requested.includes("resiPrivate");

  const onConfirmApprove = () => {
    onApprove?.({ id: row.id, approvePublic, approvePrivate, note });
    setOpen(false);
  };
  const onConfirmReject = () => {
    onReject?.({ id: row.id, note });
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">
          <Eye className="h-4 w-4" /> Review
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-[1000]" />
        <Dialog.Content className="fixed left-1/2 max-h-[80vh] top-1/2 w-[680px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-5 shadow-xl overflow-auto z-[1001]">
          <Dialog.Title className="text-lg font-semibold mb-1">
            {row.title}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-600 mb-4">
            Review request and decide availability.
          </Dialog.Description>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-3">
                <div className="text-xs text-gray-500">Type</div>
                <div className="mt-1">
                  <TypeBadge type={row.type} />
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs text-gray-500">Requested</div>
                <div className="mt-1 flex gap-2 flex-wrap">
                  {row.requested.includes("cockpitPublic") && (
                    <Chip label="Cockpit (Public)" tone="green" />
                  )}
                  {row.requested.includes("resiPrivate") && (
                    <Chip label="Resi (Private)" tone="blue" />
                  )}
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs text-gray-500">Uploader</div>
                <div className="mt-1 text-sm">{row.uploader.name}</div>
                {row.uploader.email && (
                  <div className="text-xs text-gray-500">
                    {row.uploader.email}
                  </div>
                )}
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs text-gray-500">Submitted</div>
                <div className="mt-1 text-sm">
                  {new Date(row.submittedAt).toLocaleString()}
                </div>
              </div>
            </div>

            {row.meta && (
              <div className="rounded-lg border p-3">
                <div className="text-xs text-gray-500 mb-2">Metadata</div>
                <div className="text-xs text-gray-700 space-y-1">
                  {row.meta.crs && <div>CRS: {row.meta.crs}</div>}
                  {row.meta.bbox && <div>BBOX: {row.meta.bbox.join(", ")}</div>}
                  {row.meta.layers && row.meta.layers.length > 0 && (
                    <div>
                      Layers: {row.meta.layers.slice(0, 5).join(", ")}
                      {row.meta.layers.length > 5 ? "…" : ""}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-3",
                  publicDisabled && "opacity-60",
                )}
              >
                <Checkbox.Root
                  disabled={publicDisabled}
                  checked={approvePublic}
                  onCheckedChange={(v) => setApprovePublic(!!v)}
                  className={cn(
                    "h-5 w-5 rounded border flex items-center justify-center mt-0.5",
                    approvePublic
                      ? "bg-gubenAccent border-gubenAccent"
                      : "bg-white border-gray-400",
                  )}
                >
                  <Checkbox.Indicator
                    className={cn(
                      approvePublic ? "text-white" : "text-transparent",
                    )}
                  >
                    <Check className="h-4 w-4" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <div>
                  <div className="font-medium">Approve Cockpit (Public)</div>
                  <div className="text-xs text-gray-500">
                    Make available in Masterportal.
                  </div>
                </div>
              </label>

              <label
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-3",
                  privateDisabled && "opacity-60",
                )}
              >
                <Checkbox.Root
                  disabled={privateDisabled}
                  checked={approvePrivate}
                  onCheckedChange={(v) => setApprovePrivate(!!v)}
                  className={cn(
                    "h-5 w-5 rounded border flex items-center justify-center mt-0.5",
                    approvePrivate
                      ? "bg-gubenAccent border-gubenAccent"
                      : "bg-white border-gray-400",
                  )}
                >
                  <Checkbox.Indicator
                    className={cn(
                      approvePrivate ? "text-white" : "text-transparent",
                    )}
                  >
                    <Check className="h-4 w-4" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <div>
                  <div className="font-medium">Approve Resi (Private)</div>
                  <div className="text-xs text-gray-500">
                    Serve via secure Topic endpoint.
                  </div>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Note (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a short note for the submitter or audit log…"
                className="w-full bg-white rounded-lg border border-gray-300 px-3 py-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-gubenAccent"
              />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <Dialog.Close asChild>
              <button className="rounded-md px-3 py-2 text-sm border hover:bg-gray-50">
                Close
              </button>
            </Dialog.Close>

            <div className="flex items-center gap-2">
              <button
                onClick={onConfirmReject}
                className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4" /> Reject
              </button>
              <button
                onClick={onConfirmApprove}
                className="inline-flex items-center gap-2 rounded-md bg-gubenAccent text-white px-3 py-2 text-sm hover:opacity-90"
              >
                <Check className="h-4 w-4" /> Approve
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
