import { useEffect, useState } from "react";
import { useNextcloudGetImage } from "@/endpoints/gubenComponents";
import { BaseImgTag } from "@/components/ui/BaseImgTag";
import { cn } from "@/lib/utils";
import { FilesResponse } from "@/endpoints/gubenSchemas";

interface NextcloudImageGalleryProps {
  images?: FilesResponse[];
  className?: string;
}

export const NextcloudImageGallery = ({ images, className }: NextcloudImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return <div className="p-4 text-center text-gray-500">No images available</div>;
  }

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index === selectedImageIndex ? null : index);
  };

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4", className)}>
      {images.map((image, index) => (
        <NextcloudImage
          key={image.filename}
          filename={image.filename}
          isSelected={index === selectedImageIndex}
          onClick={() => handleImageClick(index)}
        />
      ))}
    </div>
  );
};

interface NextcloudImageProps {
  filename?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const NextcloudImage = ({ filename, isSelected, onClick }: NextcloudImageProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { data: imageData, isLoading, isError } = useNextcloudGetImage({
    queryParams: { filename }
  });

  // Clean up object URLs when component unmounts or when imageData changes
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  useEffect(() => {
    if (imageData instanceof Blob) {
      const url = URL.createObjectURL(imageData);
      setImageUrl(url);

      return () => {
        URL.revokeObjectURL(url); // Clean up on unmount
      };
    }
  }, [imageData]);

  if (isLoading) {
    return (
      <div className="aspect-square bg-gray-100 animate-pulse rounded-md flex items-center justify-center">
        <span className="text-sm text-gray-400">Loading...</span>
      </div>
    );
  }

  if (isError || !imageUrl) {
    return (
      <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
        <span className="text-sm text-red-400">Failed to load image</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "cursor-pointer transition-all duration-200 rounded-md overflow-hidden border",
        isSelected ? "ring-2 ring-primary scale-105" : "hover:scale-102"
      )}
      onClick={onClick}
    >
      <BaseImgTag
        src={imageUrl}
        alt={filename || "Nextcloud image"}
        className="w-full h-full object-cover aspect-square"
      />
    </div>
  );
};
