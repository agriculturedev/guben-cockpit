import React, { useState } from "react";
import { useNextcloudCreateFile } from "@/endpoints/gubenComponents";
import { Button } from "@/components/ui/button";

export const UploadImageCard: React.FC = () => {
  const [filename, setFilename] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const createFileMutation = useNextcloudCreateFile();

  const onUpload = async () => {
    if (!filename || !file) {
      alert("Please enter a filename and select a file");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", file);

      await createFileMutation.mutateAsync({
        queryParams: { filename },
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
    <div>
      <input
        type="text"
        placeholder="Enter image filename"
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <Button onClick={onUpload} disabled={createFileMutation.isPending}>
        {createFileMutation.isPending ? "Uploading..." : "Upload Image"}
      </Button>
      {createFileMutation.isError && (
        <p style={{ color: "red" }}>Upload failed. Please try again.</p>
      )}
    </div>
  );
};
