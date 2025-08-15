import { useRef, useState } from "react";
import { useDroppable } from "@dnd-kit/core";

export interface DragAndDropProps {
  onFileSelected: (file: File | null) => void;
  acceptExtensions?: string[];
  maxSizeBytes?: number;
  className?: string;
  disabled?: boolean;
  label?: string;
  hint?: string;
}

const DragAndDrop: React.FC<DragAndDropProps> = ({
  onFileSelected,
  acceptExtensions = [],
  maxSizeBytes,
  className = "",
  disabled = false,
  label = "Drag & drop your file here",
  hint = "Click or drop to upload",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOver, setIsOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const { setNodeRef } = useDroppable({ id: "geodata-dropzone" });

  const validate = (f: File) => {
    if (acceptExtensions.length > 0) {
      const ok = acceptExtensions.some((ext) =>
        f.name.toLowerCase().endsWith(ext.toLowerCase())
      );
      if (!ok) return `Unsupported file type. Allowed: ${acceptExtensions.join(", ")}`;
    }
    if (maxSizeBytes && f.size > maxSizeBytes) {
      return `File too large. Max ${(maxSizeBytes / (1024 * 1024)).toFixed(0)} MB`;
    }
    return null;
  };

  const pick = (f: File | null) => {
    setError(null);
    if (!f) {
      setFileName(null);
      onFileSelected(null);
      return;
    }
    const v = validate(f);
    if (v) {
      setError(v);
      setFileName(null);
      onFileSelected(null);
      return;
    }
    setFileName(f.name);
    onFileSelected(f);
  };

  const onBrowse = () => !disabled && inputRef.current?.click();
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    pick(e.target.files?.[0] ?? null);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();

    const types = Array.from(e.dataTransfer.types || []);
    if (types.includes("Files")) {
      e.dataTransfer.dropEffect = "copy";
      if (!isOver) setIsOver(true);
    }
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      pick(files[0]);
    }
  };

  return (
    <div className={className}>
      <div
        ref={setNodeRef}
        role="button"
        tabIndex={0}
        aria-label="File dropzone"
        onClick={onBrowse}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onBrowse()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={[
          "rounded-2xl border-2 border-dashed p-8 text-center transition select-none",
          disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
          isOver ? "border-gubenAccent bg-gubenAccent/5" : "border-gray-300",
        ].join(" ")}
      >
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-500 mt-1">{hint}</p>

        {acceptExtensions.length > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            Accepted: {acceptExtensions.join(", ")}
          </p>
        )}

        <button
          type="button"
          className="mt-3 rounded-lg bg-gubenAccent text-white px-4 py-2 hover:opacity-90"
          disabled={disabled}
        >
          Browse files
        </button>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={acceptExtensions.length ? acceptExtensions.join(",") : undefined}
          onChange={onInputChange}
          disabled={disabled}
        />
      </div>

      {fileName && (
        <div className="rounded-lg border px-4 py-3 text-sm flex items-center justify-between mt-3">
          <div className="truncate">
            <span className="font-medium">Selected:</span> {fileName}
          </div>
          <button
            type="button"
            className="text-red-600 hover:underline ml-4"
            onClick={() => pick(null)}
            disabled={disabled}
          >
            Remove
          </button>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-700 text-sm mt-3">
          {error}
        </div>
      )}
    </div>
  );
};

export { DragAndDrop };
