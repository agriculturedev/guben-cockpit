import { useState } from "react";
import { Pencil, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isNullOrUndefinedOrWhiteSpace } from "@/utilities/nullabilityUtils";
import { BaseImgTag } from "@/components/ui/BaseImgTag";

interface EditableImageProps {
  imageUrl?: string;
  imageAlt?: string;
  onChange: (imageUrl?: string) => void;
  startInEditingState?: boolean;
}

export const EditableImage = ({imageUrl, imageAlt, onChange, startInEditingState = false}: EditableImageProps) => {
  const [isEditing, setIsEditing] = useState(startInEditingState);
  const [newUrl, setNewUrl] = useState(imageUrl);

  const handleSave = () => {
    if(!isNullOrUndefinedOrWhiteSpace(newUrl)){
      setIsEditing(false);
    }
    onChange(newUrl);
  };

  const handleCancel = () => {
    if(!isNullOrUndefinedOrWhiteSpace(newUrl)) {
      setIsEditing(false);
    }
    setNewUrl(imageUrl);
  };

  return (
    <div className="relative border rounded-lg overflow-hidden">
      {isEditing ? (
        <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 p-4">
          <Input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="mb-2"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} type={"button"}>
              <Save className="w-4 h-4"/> Save
            </Button>
            <Button size="sm" variant="destructive" onClick={handleCancel} type={"button"}>
              <X className="w-4 h-4"/> Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full">
          <BaseImgTag src={newUrl} alt={imageAlt} className="w-full h-full object-cover"/>

          <button
            className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="w-4 h-4"/>
          </button>

        </div>
      )}
    </div>
  );
}
