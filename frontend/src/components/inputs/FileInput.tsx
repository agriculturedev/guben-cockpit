import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface IProps {
  files: File[];
  setFiles: (files: File[]) => void;
  images?: boolean;
}

export function FileInput({ files, setFiles, images }: IProps) {
  const { t } = useTranslation("projects");

  const accept = images ? "image/*" : "application/pdf";
  const addLabel = images ? t("AddImages") : t("AddPdfs");

  return (
    <div className="flex flex-col gap-2">
      {files.map((file, index) => (
        <div key={index} className="flex gap-2 items-center">
          <Input
            className="min-w-20 max-w-56"
            value={file.name}
            readOnly
          />
          <Button
            variant="ghost"
            className="text-red-500 hover:text-red-700"
            onClick={() =>
              setFiles(files.filter((_, i) => i !== index))
            }
          >
            {t("Remove")}
          </Button>
        </div>
      ))}

      <div className="flex gap-2 items-center">
        <label className="cursor-pointer px-4 py-2 bg-gray-100 text-sm border border-gray-300 rounded hover:bg-gray-200">
          {addLabel}
          <input
            type="file"
            accept={accept}
            multiple
            className="hidden"
            onChange={(e) => {
              const selected = Array.from(e.target.files ?? []);
              setFiles([...files, ...selected]);
              e.target.value = "";
            }}
          />
        </label>
      </div>
    </div>
  )
}