import { useState } from "react";
import { useTranslation } from "react-i18next";
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
  }) => void;
  onReject?: (payload: { id: string }) => void;
}

export const ReviewDialog: React.FC<ReviewDialogProps> = ({
  row,
  onApprove,
  onReject,
}) => {
  const { t } = useTranslation(["common", "geodata"]);
  const [open, setOpen] = useState(false);
  const [approvePublic, setApprovePublic] = useState(
    row.requested === "cockpitPublic",
  );
  const [approvePrivate, setApprovePrivate] = useState(
    row.requested === "resiPrivate",
  );

  const publicDisabled = row.requested !== "cockpitPublic";
  const privateDisabled = row.requested !== "resiPrivate";

  const onConfirmApprove = () => {
    onApprove?.({ id: row.id, approvePublic, approvePrivate });
    setOpen(false);
  };
  const onConfirmReject = () => {
    onReject?.({ id: row.id });
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">
          <Eye className="h-4 w-4" /> {t('geodata:Review')}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-[1000]" />
        <Dialog.Content className="fixed left-1/2 max-h-[80vh] top-1/2 w-[680px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-5 shadow-xl overflow-auto z-[1001]">
          <Dialog.Title className="text-lg font-semibold mb-1">
            {row.title}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-600 mb-4">
            {t('geodata:ReviewDialogTitle')}
          </Dialog.Description>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-3">
                <div className="text-xs text-gray-500">{t('common:Type')}</div>
                <div className="mt-1">
                  <TypeBadge type={row.type} />
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs text-gray-500">{t('common:Requested')}</div>
                <div className="mt-1 flex gap-2 flex-wrap">
                  {row.requested === "cockpitPublic" && (
                    <Chip label="Cockpit (Public)" tone="green" />
                  )}
                  {row.requested === "resiPrivate" && (
                    <Chip label="Resi (Private)" tone="blue" />
                  )}
                </div>
              </div>
            </div>

            {row.meta?.path && (
              <div className="rounded-lg border p-3">
                <div className="text-xs text-gray-500 mb-2">{t('geodata:Metadata')}</div>
                <div className="text-xs text-gray-700 space-y-1">
                  <div className="text-gray-500">{t('geodata:Path')}: {row.meta.path}</div>
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
                  <div className="font-medium">{t('geodata:ApproveCockpitPublic')}</div>
                  <div className="text-xs text-gray-500">
                    {t('geodata:ApproveCockpitPublicDesc')}
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
                  <div className="font-medium">{t('geodata:ApproveResiPrivate')}</div>
                  <div className="text-xs text-gray-500">
                    {t('geodata:ApproveResiPrivateDesc')}
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <Dialog.Close asChild>
              <button className="rounded-md px-3 py-2 text-sm border hover:bg-gray-50">
                {t('geodata:Close')}
              </button>
            </Dialog.Close>

            <div className="flex items-center gap-2">
              <button
                onClick={onConfirmReject}
                className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4" /> {t('geodata:Reject')}
              </button>
              <button
                onClick={onConfirmApprove}
                className="inline-flex items-center gap-2 rounded-md bg-gubenAccent text-white px-3 py-2 text-sm hover:opacity-90"
              >
                <Check className="h-4 w-4" /> {t('geodata:Approve')}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
