import { useState, useMemo } from "react";

import { TypeBadge } from "./typeBadge";
import { ReviewDialog } from "./reviewDialog";
import { Chip } from "./chip";

export type DestinationRequest = "cockpitPublic" | "resiPrivate";
export type GeodataType =
  | "service_wms"
  | "service_wfs"
  | "file_vector"
  | "file_raster";
export type GeodataState =
  | "pending_approval"
  | "validating"
  | "invalid"
  | "rejected"
  | "published";

export interface GeodataRow {
  id: string;
  title: string;
  type: GeodataType;
  requested: DestinationRequest[];
  uploader: { name: string; email?: string };
  submittedAt: string;
  state: GeodataState;
  meta?: {
    crs?: string;
    bbox?: [number, number, number, number];
    layers?: string[];
  };
}

export interface GeodataManagerTabProps {
  items: GeodataRow[];
  onApprove?: (payload: {
    id: string;
    approvePublic: boolean;
    approvePrivate: boolean;
    note?: string;
  }) => void;
  onReject?: (payload: { id: string; note?: string }) => void;
  isLoading?: boolean;
}

export const GeodataManagerTab: React.FC<GeodataManagerTabProps> = ({
  items,
  isLoading,
  onApprove,
  onReject,
}) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.uploader.name.toLowerCase().includes(q),
    );
  }, [items, query]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Review uploads</h2>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title/uploader…"
          className="w-64 bg-white rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gubenAccent"
        />
      </div>

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Requested</th>
              <th className="px-4 py-3">Uploader</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Loading…
                </td>
              </tr>
            )}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No items found.
                </td>
              </tr>
            )}

            {filtered.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-4 py-3">
                  <div className="font-medium">{row.title}</div>
                  <div className="text-xs text-gray-500">{row.id}</div>
                </td>
                <td className="px-4 py-3">
                  <TypeBadge type={row.type} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 flex-wrap">
                    {row.requested.includes("cockpitPublic") && (
                      <Chip label="Cockpit (Public)" tone="green" />
                    )}
                    {row.requested.includes("resiPrivate") && (
                      <Chip label="Resi (Private)" tone="blue" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{row.uploader.name}</div>
                  {row.uploader.email && (
                    <div className="text-xs text-gray-500">
                      {row.uploader.email}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <time className="text-gray-700">
                    {new Date(row.submittedAt).toLocaleString()}
                  </time>
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
