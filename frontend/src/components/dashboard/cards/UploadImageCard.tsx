import React, { useRef, useState } from "react";
import { useNextcloudCreateFile } from "@/endpoints/gubenComponents";
import { Button } from "@/components/ui/button";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const UploadImageCard: React.FC = () => {
  const [filename, setFilename] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const createFileMutation = useNextcloudCreateFile();
  const {t} = useTranslation(["dashboard"]);

  const onUpload = async () => {
    if (!filename || !file) {
      alert("Please enter a filename and select a file");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", file);

      await createFileMutation.mutateAsync({
        queryParams: {filename},
        body: formData as any,
        // Add this to override the default JSON content type
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Upload successful!");
      setFilename("");
      setFile(null);
    } catch (error) {
      alert("Upload failed");
      console.log("Upload error:", error);
    }
  };

  return (
    <div className="flex-col flex gap-2">
      <h1>{t("UploadImage")}</h1>
      <div className={"flex gap-2 items-center"}>

        <Input
          className={"min-w-20 max-w-56"}
          placeholder={t("Filename")}
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
        />


        <FileUpload setFile={setFile} />
      </div>
      <Button onClick={onUpload} disabled={createFileMutation.isPending} className={"max-w-40"}>
        {createFileMutation.isPending ? "Uploading..." : t("UploadImage")}
      </Button>
      {createFileMutation.isError && (
        <p style={{color: "red"}}>Upload failed. Please try again.</p>
      )}
    </div>
  );
};

function FileUpload({ setFile }: { setFile: (file: File | null) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const {t} = useTranslation(["dashboard"]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      <Button type="button" variant="outline" onClick={handleClick}>
        {t("SelectImage")}
      </Button>
    </div>
  );
}
