import { useState, useMemo } from "react";

import { TypeBadge } from "./typeBadge";
import { ReviewDialog } from "./reviewDialog";
import { Chip } from "./chip";
import { useTranslation } from "react-i18next";

export type DestinationRequest = "cockpitPublic" | "resiPrivate";
export type GeodataType = "WFS" | "WMS";
export type GeodataState = "pending_approval" | "published";

export interface GeodataRow {
  id: string;
  title: string;
  type: GeodataType;
  requested: DestinationRequest;
  state: GeodataState;
  meta?: { path: string };
}

export interface GeodataManagerTabProps {
  items: GeodataRow[];
  onApprove?: (payload: {
    id: string;
    approvePublic: boolean;
    approvePrivate: boolean;
  }) => void;
  onReject?: (payload: { id: string; }) => void;
  isLoading?: boolean;
}

export const GeodataManagerTab: React.FC<GeodataManagerTabProps> = ({
  items,
  isLoading,
  onApprove,
  onReject,
}) => {
  const { t } = useTranslation(["common", "geodata"]);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.title.toLowerCase().includes(q));
  }, [items, query]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">{t('geodata:ReviewUploads')}</h2>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('geodata:SearchByTitle')}
          className="w-64 bg-white rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gubenAccent"
        />
      </div>

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="px-4 py-3">{t('common:Title')}</th>
              <th className="px-4 py-3">{t('common:Type')}</th>
              <th className="px-4 py-3">{t('common:Requested')}</th>
              <th className="px-4 py-3">{t('common:State')}</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  {t('common:Loading')}...
                </td>
              </tr>
            )}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  {t('common:NoResults')}
                </td>
              </tr>
            )}

            {filtered.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-4 py-3">
                  <div className="font-medium">{row.title}</div>
                </td>
                <td className="px-4 py-3">
                  <TypeBadge type={row.type} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 flex-wrap">
                    {row.requested === 'cockpitPublic' && (
                      <Chip label="Cockpit (Public)" tone="green" />
                    )}
                    {row.requested === 'resiPrivate' && (
                      <Chip label="Resi (Private)" tone="blue" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      row.state === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {row.state}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <ReviewDialog
                    row={row}
                    onApprove={onApprove}
                    onReject={onReject}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
