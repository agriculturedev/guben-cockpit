import { useEffect, useState } from "react";
import { useNextcloudGetImage } from "@/endpoints/gubenComponents";
import { BaseImgTag } from "@/components/ui/BaseImgTag";
import { cn } from "@/lib/utils";
import { FilesResponse } from "@/endpoints/gubenSchemas";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog } from "../ui/dialog";

interface NextcloudImageGalleryProps {
  images?: FilesResponse[];
  className?: string;
}

export const NextcloudImageGallery = ({ images, className }: NextcloudImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleClose = () => {
    setSelectedImageIndex(null);
  };

  return (
    <>
      <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4", className)}>
        {images?.map((image, index) => (
          <NextcloudImage
            key={image.filename}
            previewUrl={image.filename}
            fullUrl={image.filename}
            onClick={() => handleImageClick(index)}
          />
        ))}
      </div>

      {selectedImageIndex !== null && images?.[selectedImageIndex] && (
        <ImageDialog
          filename={images[selectedImageIndex].filename}
          onClose={handleClose}
        />
      )}
    </>
  );
};

interface CarouselProps {
  currentIndex: number;
  totalImages: number;
  onPrevious?: () => void;
  onNext?: () => void;
  images: Array<{ filename: string; previewUrl: string }>;
}

interface NextCloudClickableImageProps {
  imageFilename: string;
  previewImage: string;
  isExternal?: boolean;
  carouselProps?: CarouselProps;
}

export const NextCloudClickableImage = ({imageFilename, isExternal, carouselProps, previewImage}: NextCloudClickableImageProps) => {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState(carouselProps?.currentIndex ?? 0);
  const shortFilename = imageFilename.split("/").pop()?.split(".")[0];

  const handleImageClick = () => {
    setShowDialog(true);
    setCurrentIndex(carouselProps?.currentIndex ?? 0);
  };

  const handleClose = () => {
    setShowDialog(false);
  };

  return (
    <>
      <div>
        {isExternal ? (
          <ExternalImage url={imageFilename} onClick={handleImageClick} />
        ) : (
          <NextcloudImage
            key={imageFilename}
            previewUrl={previewImage}
            fullUrl={imageFilename}
            onClick={handleImageClick}
          />
        )}
        <Label>{decodeURIComponent(shortFilename ?? "")}</Label>
      </div>

      {showDialog && imageFilename && (
        isExternal ? (
          <ExternalImageDialog filename={imageFilename} onClose={handleClose} />
        ) : carouselProps && carouselProps.images.length > 0 ? (
          <ImageCarouselDialog
            images={carouselProps.images}
            currentIndex={currentIndex}
            onClose={handleClose}
            onIndexChange={setCurrentIndex}
          />
        ) : null
      )}
    </>
  );
};


interface NextcloudImageProps {
  previewUrl: string;
  fullUrl?: string;
  onClick?: () => void;
}

const NextcloudImage = ({ previewUrl, fullUrl, onClick }: NextcloudImageProps) => {
  const [imageUrl, setImageUrl] = useState<string>(previewUrl);

  const { data: imageData, isLoading } = useNextcloudGetImage({ queryParams: { filename: fullUrl } });

  // Revoke old object URLs for memory management
  useEffect(() => {
    return () => {
      if (imageUrl && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  useEffect(() => {
    if (imageData instanceof Blob) {
      const url = URL.createObjectURL(imageData);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageData, fullUrl]);

  return (
    <div
      className="cursor-pointer rounded-md overflow-hidden border hover:scale-102 transition-all duration-200"
      onClick={onClick}
    >
      <BaseImgTag
        src={imageUrl}
        alt="Nextcloud image"
        className="w-full h-full object-contain aspect-square"
      />
    </div>
  );
};

interface ImageDialogProps {
  filename: string;
  onClose: () => void;
}

export const ImageDialog = ({ filename, onClose }: ImageDialogProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { data: imageData } = useNextcloudGetImage({ queryParams: { filename } });

  useEffect(() => {
    if (imageData instanceof Blob) {
      const url = URL.createObjectURL(imageData);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageData]);

  return (
    <Dialog open onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
        <div className="relative bg-white rounded-xl max-w-[90vw] w-full max-h-[90vh] p-4 shadow-xl overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-black z-20"
          >
            ✕
          </button>

          {imageUrl ? (
            <BaseImgTag
              src={imageUrl}
              alt={filename}
              className="w-full h-auto max-h-[80vh] object-contain mx-auto z-0"
            />
          ) : (
            <div className="text-center text-gray-500">Loading image...</div>
          )}
        </div>
      </div>
    </Dialog>
  );
};


interface ExternalImageDialogProps {
  filename: string;
  onClose: () => void;
}

export const ExternalImageDialog = ({ filename, onClose }: ExternalImageDialogProps) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
        <div className="relative bg-white rounded-xl max-w-[90vw] w-full max-h-[90vh] p-4 shadow-xl overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-black z-20"
          >
            ✕
          </button>

          <BaseImgTag
            src={filename}
            alt={filename}
            className="w-full h-auto max-h-[80vh] object-contain mx-auto z-0"
          />
        </div>
      </div>
    </Dialog>
  );
};

interface ExternalImageProps {
  url: string;
  onClick?: () => void;
  label?: string;
}

const ExternalImage = ({ url, onClick, label }: ExternalImageProps) => {
  return (
    <div
      className="cursor-pointer rounded-md overflow-hidden border hover:scale-102 transition-all duration-200"
      onClick={onClick}
    >
      {label && (
        <div className="mt-2 font-semibold text-lg">
          {decodeURIComponent(url)}
        </div>
      )}
      <BaseImgTag
        src={url}
        alt={label || "External image"}
        className="w-full h-full object-contain aspect-square"
      />
    </div>
  );
};

interface ImageCarouselDialogProps {
  images: Array<{ 
    filename: string;
    previewUrl: string;
  }>;
  currentIndex: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export const ImageCarouselDialog = ({
  images,
  currentIndex,
  onClose,
  onIndexChange,
}: ImageCarouselDialogProps) => {
  const currentImage = images[currentIndex];
  const [imageUrl, setImageUrl] = useState(currentImage.previewUrl);

  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  const { data: imageData } = useNextcloudGetImage({
    queryParams: { filename: currentImage.filename },
  });

  useEffect(() => {
    if (!(imageData instanceof Blob)) return;

    const url = URL.createObjectURL(imageData);
    setImageUrl(url);
    setBlobUrl(url);
    
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [imageData, currentImage.filename]);

  // Revoke old Blob for memory management
  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
        setBlobUrl(null);
      }
    };
  }, [currentIndex]);

  const handlePrevious = () => { if (currentIndex > 0) onIndexChange(currentIndex - 1); };
  const handleNext = () => { if (currentIndex < images.length - 1) onIndexChange(currentIndex + 1); };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images.length]);

  return (
    <Dialog open onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
        <div className="relative bg-white rounded-xl max-w-[90vw] w-full max-h-[90vh] p-4 shadow-xl overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-black z-20"
          >
            ✕
          </button>

          {currentIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
              className="group absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-300 bg-opacity-70 rounded-full p-2 z-20"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800 group-hover:text-red-500" />
            </button>
          )}

          {currentIndex < images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="group absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-300 bg-opacity-70 rounded-full p-2 z-20"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-gray-800 group-hover:text-red-500" />
            </button>
          )}

          <div className="relative z-10 min-h-[80vh] flex items-center justify-center">
            {imageUrl ? (
              <BaseImgTag
                src={imageUrl}
                alt={currentImage?.filename}
                className="w-full h-auto max-h-[80vh] object-contain mx-auto z-0"
              />
            ) : (
              <div className="text-center text-gray-500 animate-pulse">Loading image...</div>
            )}
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/20 text-white px-3 py-1 rounded-full text-sm z-20">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </div>
    </Dialog>
  );
};