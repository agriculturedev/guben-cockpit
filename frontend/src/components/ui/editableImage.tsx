import { useState } from "react";
import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BaseImgTag } from "@/components/ui/BaseImgTag";
import { useTranslation } from "react-i18next";
import { isNullOrUndefinedOrWhiteSpace } from "@/utilities/nullabilityUtils";

interface EditableImageProps {
  imageUrl?: string;
  imageAlt?: string;
  onChange: (imageUrl?: string) => void;
  startInEditingState?: boolean;
}

export const EditableImage = ({imageUrl, imageAlt, onChange, startInEditingState = false}: EditableImageProps) => {
  const imageUrlIsEmpty = isNullOrUndefinedOrWhiteSpace(imageUrl);
  const [isEditing, setIsEditing] = useState(startInEditingState || imageUrlIsEmpty);
  const {t} = useTranslation(["common"]);

  const toggleEditing = () => {
    setIsEditing(true);
  }

  const togglePreview = () => {
    if (!imageUrlIsEmpty) {
      setIsEditing(false);
    }
  }

  return (
    <div className="relative border rounded-lg overflow-hidden">
      {isEditing ? (
        <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 p-4">
          <Input
            value={imageUrl}
            onChange={(e) => onChange(e.target.value)}
            className="mb-2"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={togglePreview} disabled={imageUrlIsEmpty} type={"button"}>
              {t("ShowPreview")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full">
          <BaseImgTag src={imageUrl} alt={imageAlt} className="w-full h-full object-cover"/>

          <button
            className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
            onClick={toggleEditing}
          >
            <Pencil className="w-4 h-4"/>
          </button>

        </div>
      )}
    </div>
  );
}
